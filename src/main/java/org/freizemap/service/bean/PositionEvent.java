package org.freizemap.service.bean;

import org.freizemap.service.extraction.dbpedia.sample.dbpedia.DBpediaConstante;

import com.google.common.base.Objects.ToStringHelper;

public class PositionEvent extends EventFM {

	private static final long serialVersionUID = -5744302900568279856L;

	// transient public static final String FORMAT = "yyyy-MM-DD'T'HH:mm:ssZ";

	public static String CONTEXT_ROOT_URI_DBPEDIA = DBpediaConstante.DEFAULT_NAMESPACE;

	public String TYPE_POSITION_EVENT = "TypePositionEvent";

	// To get the resource: http://en.wikipedia.org/wiki?curid=>>>>wikiID<<<<<<<
	private int wikiID = 1;

	private String nameSurname;

	// sans http://dbpedia.org/resource/
	private String resourceUri;

	private String birthPlaceURI;

	public PositionEvent() {
		super.setType(TYPE_POSITION_EVENT);
	}

	public int getWikiID() {
		return wikiID;
	}

	public void setWikiID(int wikiID) {
		this.wikiID = wikiID;
	}

	public String getNameSurname() {
		return nameSurname;
	}

	public void setNameSurname(String nameSurname) {
		this.nameSurname = nameSurname;
	}

	public String getResourceUri() {
		return resourceUri;
	}

	public void setResourceUri(String resourceUri) {
		this.resourceUri = resourceUri;
	}

	public String getBirthPlaceURI() {
		return birthPlaceURI;
	}

	public void setBirthPlaceURI(String birthPlaceURI) {
		this.birthPlaceURI = birthPlaceURI;
	}

	/**
	 * override to add properties
	 * 
	 * @param helper
	 *            helper
	 * @return
	 */
	protected ToStringHelper addProperties(ToStringHelper helper) {
		return super.addProperties(helper).add("wikiID", wikiID)
				.add("nameSurname", nameSurname)
				.add("resourceUri", resourceUri)
				.add("birthPlaceURI", birthPlaceURI);

	}

}
