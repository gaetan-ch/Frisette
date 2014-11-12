package org.freizemap.service.extraction.dbpedia.sample.dbpedia;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.log4j.Logger;
import org.freizemap.service.DBPediaService;
import org.freizemap.service.bean.EventFM;
import org.freizemap.service.bean.PositionEvent;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Component;

import com.google.common.collect.Lists;

/**
 * 
 * 
 */
@Component
public class SparqlQueryExecuter {

	private final static Logger LOG = Logger
			.getLogger(SparqlQueryExecuter.class);
	public static String DEFAULT_NAMESPACE = "http://dbpedia.org/resource/";
	// Create an instance of HttpClient.
	private static HttpClient client = new HttpClient();
	@Value("${mainGraph}")
	String mainGraph;
	@Value("${sparqlUrl}")
	String sparqlUrl;

	@Value("${extraction.request.dbpedia.premiere}")
	String request;

	public SparqlQueryExecuter() {
	}

	public SparqlQueryExecuter(String mainGraph, String sparqlUrl) {
		this.mainGraph = mainGraph;
		this.sparqlUrl = sparqlUrl;
	}

	// this is the virtuoso way. subclasses can override for other
	// implementations
	// http://dbpedia.org/sparql?default-graph-uri=http://dbpedia.org&query=select+distinct+%3Fpol+where+{%3Fpol+a+%3Chttp://dbpedia.org/ontology/Politician%3E+}&debug=on&timeout=&format=text/html&save=display&fname=
	protected URL getUrl(String query) throws UnsupportedEncodingException,
			MalformedURLException {
		String graphEncoded = URLEncoder.encode(mainGraph, "UTF-8");
		String formatEncoded = URLEncoder.encode(
				"application/sparql-results+json", "UTF-8");
		String queryEncoded = URLEncoder.encode(query, "UTF-8");
		String url = sparqlUrl + "?" + "default-graph-uri=" + graphEncoded
				+ "&query=" + queryEncoded + "&format=" + formatEncoded
				+ "&debug=on&timeout=";
		return new URL(url);
	}

	public List<PositionEvent> query() throws IOException, Exception,
			SparqlExecutionException {
		if (request == null)
			return new ArrayList<PositionEvent>();
		LOG.debug("--SPARQL QUERY: " + request.replace("\n", " "));

		URL url = getUrl(request.replaceAll("\n", " "));
		// LOG.trace(url);

		// FIXME Do some test with the returned results to see if there actually
		// are results.
		List<PositionEvent> resourceList = null;
		String response = null;
		try {
			// uris = parse(readOutput(get(url)));
			response = request(url);
			LOG.info("Request executed. Response parsing...");
			resourceList = parse(response);
			LOG.info("Response parsed");

		} catch (JSONException e) {
			throw new Exception(e + response);
		}
		LOG.debug(String.format("-- %s found.", resourceList.size()));
		return resourceList;
	}

	public String update(String query) throws SparqlExecutionException {
		String response = null;
		try {
			URL url = getUrl(query);
			response = request(url);
		} catch (Exception e) {
			throw new SparqlExecutionException(e);
		}
		return response;
	}

	public String request(URL url) throws SparqlExecutionException {
		GetMethod method = new GetMethod(url.toString());
		String response = null;

		// Provide custom retry handler is necessary
		method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,
				new DefaultHttpMethodRetryHandler(3, false));

		try {
			// Execute the method.
			int statusCode = client.executeMethod(method);

			if (statusCode != HttpStatus.SC_OK) {
				LOG.error("SparqlQuery failed: " + method.getStatusLine());
				throw new SparqlExecutionException(String.format("%s (%s). %s",
						method.getStatusLine(), method.getURI(),
						method.getResponseBodyAsString()));
			}

			// Read the response body.
			byte[] responseBody = method.getResponseBody();

			// Deal with the response.
			// Use caution: ensure correct character encoding and is not binary
			// data
			response = new String(responseBody);

		} catch (HttpException e) {
			System.err.println("Fatal protocol violation: " + e.getMessage());
			throw new SparqlExecutionException(e);
		} catch (IOException e) {
			System.err.println("Fatal transport error: " + e.getMessage());
			throw new SparqlExecutionException(e);
		} finally {
			// Release the connection.
			method.releaseConnection();
		}
		return response;

	}

	/**
	 * Parses SPARQL+JSON output, getting a list of DBpedia URIs returned in
	 * *any* variable in the query. Consider moving to a class on its own if we
	 * ever use this anywhere else in the code.
	 * 
	 * @param jsonString
	 *            string representation of SPARQL+JSON results
	 * @return list of URIs as Strings contained in any variables in this
	 *         result.
	 * @throws org.json.JSONException
	 */
	private static List<PositionEvent> parse(String jsonString)
			throws JSONException {
		Map<String, PositionEvent> results = new HashMap<String, PositionEvent>();
		JSONObject root = new JSONObject(jsonString);
		JSONArray vars = root.getJSONObject("head").getJSONArray("vars");
		JSONArray bindings = root.getJSONObject("results").getJSONArray(
				"bindings");

		final int NAME = 0;
		final int RESOURCE_WIKIPEDIA_ID = 1;
		final int RESOURCE_WIKIPEDIA = 2;
		final int BIRTHDATE = 3;
		final int PLACE = 4;
		final int LAT = 5;
		final int LONG = 6;

		SimpleDateFormat parser = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat parserForFrizetteDate = new SimpleDateFormat(EventFM.FORMAT_TIMESTAMP);
		
		for (int i = 0; i < bindings.length(); i++) {
			JSONObject row = bindings.getJSONObject(i);
			PositionEvent resource = new PositionEvent();
			resource.setNameSurname(getValue(vars, NAME, row));

			resource.setWikiID(getValueInt(vars, RESOURCE_WIKIPEDIA_ID, row));

			
			resource.setResourceUri(getValue(vars, RESOURCE_WIKIPEDIA, row)
					.replace(DEFAULT_NAMESPACE, ""));

			resource.setBirthPlaceURI(getValue(vars, PLACE, row).replace(
					DEFAULT_NAMESPACE, ""));
			

			try {
				resource.setLongitude(Float.parseFloat(getValue(vars, LONG, row)));
				resource.setLatitude(Float.parseFloat(getValue(vars, LAT, row)));
				Date date = parser.parse(getValue(vars, BIRTHDATE,
						row));
				resource.setTimestampDate(date);
				resource.setTimestamp(parserForFrizetteDate.format(date));
			} catch (ParseException  e) {
				LOG.warn("Ligne NON prise en compte :" + row.toString());
				LOG.warn("Incorrect date :" + getValue(vars, BIRTHDATE, row), e);
				continue;

			} catch(NumberFormatException e){
				LOG.warn("Ligne NON prise en compte :" + row.toString());
				LOG.warn("Incorrect float value :" , e);
				continue;
			}

			results.put(resource.getNameSurname(), resource);
			/*
			 * for (int v = 0; v < vars.length(); v++) { JSONObject typeValue =
			 * row.getJSONObject((String) vars.get(v)); String uri =
			 * typeValue.getString("value").replace( DEFAULT_NAMESPACE, "");
			 * LOG.info("Ligne N�" + i + " -> " + uri + " -->"+
			 * typeValue.toString()); results.add(new DBpediaResource(uri)); }
			 */
		}

		return Lists.newArrayList(results.values());
	}

	private static String getValue(JSONArray vars, final int NAME,
			JSONObject row) {
		return (String) row.getJSONObject((String) vars.get(NAME)).getString(
				"value");
	}
	
	private static int getValueInt(JSONArray vars, final int NAME,
			JSONObject row) {
		return  row.getJSONObject((String) vars.get(NAME)).getInt(
				"value");
	}

	public static void main(String[] args) throws Exception {

		AbstractApplicationContext context = new ClassPathXmlApplicationContext(
				"applicationContext.xml");

		SparqlQueryExecuter sparqlQueryExecuter = context
				.getBean(SparqlQueryExecuter.class);
		DBPediaService dBPediaService = context.getBean(DBPediaService.class);

		SparqlQueryExecuter e = new SparqlQueryExecuter("http://dbpedia.org",
				"http://dbpedia.org/sparql");

		List<PositionEvent> listeBean = sparqlQueryExecuter.query();

		// serialized
		dBPediaService.writeAllResourceDBPedia(listeBean);
		context.registerShutdownHook();
	}

}