package org.freizemap.web.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.freizemap.service.DBPediaService;
import org.freizemap.service.bean.Area;
import org.freizemap.service.bean.LoadStrategy;
import org.freizemap.service.bean.PopulationEvent;
import org.freizemap.service.bean.PositionEvent;
import org.freizemap.service.bean.TimePeriod;
import org.freizemap.service.json.Events;
import org.freizemap.web.ConstantesWeb;
import org.freizemap.web.servlet.base.FreizeMapServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

/**
 * Servlet implementation class EventsAjaxServlet
 */
public class EventsAjaxServlet extends FreizeMapServlet {

	private static final String END_TIME = "endTime";

	private static final String START_TIME = "startTime";

	private static final long serialVersionUID = 1L;

	protected Logger LOG = LoggerFactory.getLogger(this.getClass());

	// Take care about synchronisation
	public Gson gson = new Gson();

	/**
	 * Default constructor.
	 */
	public EventsAjaxServlet() {

	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO: inject by Spring
		DBPediaService dBPediaService = getAbstractApplicationContext(request)
				.getBean(DBPediaService.class);

		Area area = getArea(request);
		LoadStrategy loadStrategy = new LoadStrategy();
		loadStrategy.resultNbr = 50;
		TimePeriod timePeriod = getTimePeriod(request);

		response.setContentType("application/json");
		// Get the printwriter object from response to write the required json
		// object to the output stream
		PrintWriter out = response.getWriter();
		// Assuming your json object is **jsonObject**, perform the following,
		// it will return your json object

		// List<PersonEvent> listePersons = dBPediaService
		// .getResourcseDBPedia(area);
		List<PositionEvent> listePositionEvent = dBPediaService
				.loadResourcesDBPedia(area, timePeriod, loadStrategy);

		List<PopulationEvent> listePopulationEvent = getListePopulationEventForTest(listePositionEvent);

		LOG.info("Nombre de points" + listePositionEvent.size());
		Events events = new Events();
		events.setEvents(listePositionEvent);
		events.setPopulationEvents(listePopulationEvent);
		String reponseTxt = gson.toJson(events);
		if (LOG.isDebugEnabled()) {
			LOG.debug("reponseTxt" + reponseTxt);
		}
		out.write(reponseTxt);

		out.flush();
	}

	private static int toDelete = 1;

	private List<PopulationEvent> getListePopulationEventForTest(
			List<PositionEvent> listePositionEven) {
		List<PopulationEvent> listePopulationEvent = new ArrayList<PopulationEvent>();
		/*if (listePositionEven.size() > 1) {
			// pour les test on met un point
			PositionEvent pe = listePositionEven.remove(0);
			PopulationEvent population = new PopulationEvent();
			population.setBirthPlaceURI(pe.getBirthPlaceURI());
			population.setLatitude(pe.getLatitude());
			population.setLongitude(pe.getLongitude());
			population.setNameSurname(pe.getNameSurname());
			population.setPopulation("50");
			population.setResourceUri(pe.getResourceUri());
			population.setTimestamp(pe.getTimestamp());
			population.setWikiID(toDelete++);
			listePopulationEvent.add(population);
		}*/
		return listePopulationEvent;
	}

	private Area getArea(HttpServletRequest request) {

		// O_Lt='+slt+'&SO_lg='+slg+'&NE_lt='+nlt+'&NE_lg
		if (this.checkParamNoPresent(request, "SO_Lt")
				&& this.checkParamNoPresent(request, "SO_lg")
				&& this.checkParamNoPresent(request, "NE_lt")
				&& this.checkParamNoPresent(request, "North_Lng")) {
			return null;
		}

		return new Area(getFloat(request, "SO_Lt"), getFloat(request, "SO_lg"),
				getFloat(request, "NE_lt"), getFloat(request, "North_Lng"));
	}

	private TimePeriod getTimePeriod(HttpServletRequest request) {
		SimpleDateFormat format = new SimpleDateFormat(
				ConstantesWeb.TIMELINER_JS_FORMAT.getValue());
		TimePeriod timePeriod = null;

		try {
			timePeriod = new TimePeriod(format.parse(request
					.getParameter(START_TIME)), format.parse(request
					.getParameter(END_TIME)));
		} catch (Exception e) {
			LOG.error("ProErreor parse parameter :" + START_TIME + " or "
					+ END_TIME, e);
		}
		return timePeriod;
	}

	private float getFloat(HttpServletRequest request, String key) {
		return Float.parseFloat(request.getParameter(key));
	}

	private boolean checkParamNoPresent(final HttpServletRequest request,
			final String param) {
		return request.getParameter(param) == null;
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
