package org.freizemap.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import junit.framework.Assert;

import org.freizemap.service.bean.Area;
import org.freizemap.service.bean.EventFM;
import org.freizemap.service.bean.LoadStrategy;
import org.freizemap.service.bean.PositionEvent;
import org.freizemap.service.bean.TimePeriod;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class DBPediaServiceTest {

	private static int LONGITUDE_INDEX = 0;

	private static int LATITUDE_INDEX = 1;

	private float[][] data = { { 10, -20 }, { 30, 20 }, { 40, 15 }, { 10, 10 },
			{ 50, 60 } };

	
	private static LoadStrategy LOADSTRATEGY = new LoadStrategy();
	private Calendar calendar = Calendar.getInstance();
	private Date nextYear = null;
	private Date today = null;
	private Date lastYear = null;

	private DBPediaService dbPediaService;

	@BeforeClass
	public static void loadService() {
		LOADSTRATEGY.resultNbr = 50;
	}
	
	@Before
	public void createService() {
		dbPediaService = new DBPediaService();
	}

	@Before
	public void loadEvents() {

		
		this.today = this.calendar.getTime();
		this.calendar.add(Calendar.YEAR, 1);
		this.nextYear = this.calendar.getTime();
		this.calendar.setTime(today);

		this.calendar.add(Calendar.YEAR, -1);
		this.lastYear = this.calendar.getTime();
		this.calendar.setTime(today);
		SimpleDateFormat parserForFrizetteDate = new SimpleDateFormat(EventFM.FORMAT_TIMESTAMP);
		
		List<PositionEvent> personnesEvent = new ArrayList<PositionEvent>();
		for (int i = 0; i < this.data.length; i++) {
			PositionEvent event = new PositionEvent();
			event.setLongitude(this.data[i][LONGITUDE_INDEX]);
			event.setLatitude(this.data[i][LATITUDE_INDEX]);
			event.setTimestamp(parserForFrizetteDate.format(today));
			personnesEvent.add(event);
		}
		this.dbPediaService.listeResourceDBPedia = personnesEvent;

	}

	@Test
	public void testAreaLoadResourcseDBPediaALL() throws Exception {

		// Area(float southWestLat, float southWestLng, float northEastLat,
		// float northEastLng)
		Area testArea = new Area(-200, -200, 300, 200);
		List<PositionEvent> personEvent = dbPediaService.loadResourcesDBPedia(
				testArea, null,LOADSTRATEGY);
		Assert.assertEquals("Tous les events aurait du être récupèré", 5,
				personEvent.size());

	}

	@Test
	public void testAreaLoadResourcseDBPediaOnePoint() throws Exception {

		// Area(float southWestLat, float southWestLng, float northEastLat,
		// float northEastLng) 30/20
		Area testArea = new Area(19, 29, 21, 31);
		List<PositionEvent> personEvent = dbPediaService.loadResourcesDBPedia(
				testArea, null,LOADSTRATEGY);
		Assert.assertEquals("Une seul évènement à récupèrer", 1,
				personEvent.size());
		PositionEvent event = personEvent.get(0);
		Assert.assertEquals("c'est le bon point", 20, (int) event.getLatitude());
		Assert.assertEquals("c'est le bon point", 30,
				(int) event.getLongitude());
	}

	@Test
	public void testAreaLoadResourcseDBPediaTwoPoints() throws Exception {

		// Area(float southWestLat, float southWestLng, float northEastLat,
		// float northEastLng) 30/20 et 40/15
		Area testArea = new Area(14, 29, 21, 41);
		List<PositionEvent> personEvent = dbPediaService.loadResourcesDBPedia(
				testArea, null,LOADSTRATEGY);
		Assert.assertEquals("Deux évènements à récupèrer", 2,
				personEvent.size());

	}

	@Test
	public void testTimePeriodLoadResourcseDBPediaNothing() throws Exception {
		// put event's date out of the period time

		Area testArea = new Area(-200, -200, 300, 200);
		TimePeriod timePeriod = new TimePeriod(this.lastYear, this.nextYear);

		this.calendar.setTime(this.lastYear);
		this.calendar.add(Calendar.DATE, -1); //
		SimpleDateFormat parserForFrizetteDate = new SimpleDateFormat(EventFM.FORMAT_TIMESTAMP);
		for (int i = 0; i < this.dbPediaService.listeResourceDBPedia.size(); i++) {

			PositionEvent event = this.dbPediaService.listeResourceDBPedia.get(i);
			event.setTimestamp(parserForFrizetteDate.format(this.calendar.getTime()));
		}

		List<PositionEvent> personEvent = dbPediaService.loadResourcesDBPedia(
				testArea, timePeriod,LOADSTRATEGY);
		Assert.assertEquals("Aucun évènement aurait du être récupèrer", 0,
				personEvent.size());

	}

	@Test
	public void testTimePeriodLoadResourcseDBPediaOne() throws Exception {
		// put just ONE event's date out of the period time
		Area testArea = new Area(-200, -200, 300, 200);
		TimePeriod timePeriod = new TimePeriod(this.lastYear, this.nextYear);

		this.calendar.setTime(this.nextYear);
		this.calendar.add(Calendar.DATE, +1); //
		SimpleDateFormat parserForFrizetteDate = new SimpleDateFormat(EventFM.FORMAT_TIMESTAMP);
		PositionEvent event = this.dbPediaService.listeResourceDBPedia.get(0);
		event.setTimestamp(parserForFrizetteDate.format(this.calendar.getTime()));

		List<PositionEvent> personEvent = dbPediaService.loadResourcesDBPedia(
				testArea, timePeriod,LOADSTRATEGY);
		Assert.assertEquals("Aucun évènement aurait du être récupèrer", 4,
				personEvent.size());

	}

	@Test
	public void testTimePeriodLoadResourcseDBPediaALL() throws Exception {

		Area testArea = new Area(-200, -200, 300, 200);
		TimePeriod timePeriod = new TimePeriod(this.lastYear, this.nextYear);

		List<PositionEvent> personEvent = dbPediaService.loadResourcesDBPedia(
				testArea, timePeriod,LOADSTRATEGY);
		Assert.assertEquals("Tous les events aurait du être récupèré", 5,
				personEvent.size());

	}
}
