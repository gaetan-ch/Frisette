package org.freizemap.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.freizemap.service.bean.Area;
import org.freizemap.service.bean.LoadStrategy;
import org.freizemap.service.bean.PositionEvent;
import org.freizemap.service.bean.TimePeriod;
import org.freizemap.util.UtilSerialized;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import com.google.common.base.Predicate;
import com.google.common.collect.Collections2;

@Component
public class DBPediaService {

	@Value("${dataBase.dbpedia.file}")
	public final String pathFileName = "dataBaseDBPedia.txt";

	List<PositionEvent> listeResourceDBPedia = null;

	public List<PositionEvent> getAllResourceDBPedia() throws IOException {

		return listeResourceDBPedia;
	}

	public List<PositionEvent> loadAnyResourceDBPedia() throws IOException {

		List<PositionEvent> liste = getAllResourceDBPedia();
		return liste.subList(0, 200);
	}

	/**
	 * if timePeriod is NULL only area is check
	 * @param area
	 * @param timePeriod can be null
	 * @return
	 * @throws IOException
	 */
	public List<PositionEvent> loadResourcesDBPedia(final Area area, final TimePeriod timePeriod, final LoadStrategy loadStrategy)
			throws IOException {

		List<PositionEvent> liste = getAllResourceDBPedia();
		Collection<PositionEvent> events = Collections2.filter(liste,
				new Predicate<PositionEvent>() {

					public boolean apply(PositionEvent input) {
						float latitude = input.getLatitude();
						float longitude = input.getLongitude();
						Date birthDate= input.getTimestampDate();
						return insideArea(area, latitude, longitude) && insideTimePeriod(timePeriod,birthDate);
					}

					private boolean insideArea(final Area area, float latitude,
							float longitude) {
						
						return area==null || latitude <= area.getNorthEastLat()
								&& latitude >= area.getSouthWestLat()
								&& longitude <= area.getNorthEastLng()
								&& longitude >= area.getSouthWestLng();
					}
					private boolean insideTimePeriod(final TimePeriod timePeriod, final Date birthDate) {
						return timePeriod==null || !birthDate.after(timePeriod.getEndPeriod()) && !birthDate.before(timePeriod.getStartPeriod());
					}
				});
		List<PositionEvent> finalEvent = new ArrayList<PositionEvent>();
		
		int index = 0;
		for (Iterator<PositionEvent> iterator = events.iterator(); iterator.hasNext();index++) {
			if(index>=loadStrategy.resultNbr){
				break;
			}
			finalEvent.add((PositionEvent) iterator.next());
		}
		
		
		return finalEvent;
	}

	public void writeAllResourceDBPedia(List<PositionEvent> listeBean) {
		UtilSerialized.serialized(pathFileName, listeBean);

	}

	/**
	 * Load on start up
	 * 
	 * @return true if the data base and the cache are OK
	 */
	public synchronized boolean initResourceDBPedia() throws IOException {

		final Resource dataBase = new ClassPathResource(pathFileName);
		listeResourceDBPedia = UtilSerialized.deserialized(dataBase
				.getInputStream());

		return true;
	}
}
