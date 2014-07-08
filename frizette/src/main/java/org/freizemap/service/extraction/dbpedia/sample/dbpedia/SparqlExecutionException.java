package org.freizemap.service.extraction.dbpedia.sample.dbpedia;

public class SparqlExecutionException extends Exception {

	private static final long serialVersionUID = -5939520052118751239L;

	public SparqlExecutionException(String msg, Exception e) {
		super(msg, e);
	}

	public SparqlExecutionException(String msg) {
		super(msg);
	}

	public SparqlExecutionException(Exception e) {
		super(e);
	}

}
