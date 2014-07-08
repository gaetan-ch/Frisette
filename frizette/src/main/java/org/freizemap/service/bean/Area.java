package org.freizemap.service.bean;

public class Area {
	private float southWestLat;
	private float southWestLng;
	private float northEastLat;
	private float northEastLng;

	public Area(float southWestLat, float southWestLng, float northEastLat, float northEastLng) {
		super();
		this.southWestLat = southWestLat;
		this.southWestLng = southWestLng;
		this.northEastLat = northEastLat;
		this.northEastLng = northEastLng;
	}

	public float getSouthWestLat() {
		return southWestLat;
	}

	public void setSouthWestLat(float southLat) {
		this.southWestLat = southLat;
	}

	public float getSouthWestLng() {
		return southWestLng;
	}

	public void setSouthWestLng(float southLng) {
		this.southWestLng = southLng;
	}

	public float getNorthEastLat() {
		return northEastLat;
	}

	public void setNorthEastLat(float northLat) {
		this.northEastLat = northLat;
	}

	public float getNorthEastLng() {
		return northEastLng;
	}

	public void setNorthEastLng(float northLng) {
		this.northEastLng = northLng;
	}

}
