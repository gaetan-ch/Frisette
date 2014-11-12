package org.freizemap.service.json;

import java.util.List;

import org.freizemap.service.bean.PopulationEvent;
import org.freizemap.service.bean.PositionEvent;

public class Events {

	private List<PositionEvent> events;

	private List<PopulationEvent> populationEvents;

	public List<PositionEvent> getEvents() {
		return events;
	}

	public void setEvents(List<PositionEvent> events) {
		this.events = events;
	}

	public List<PopulationEvent> getPopulationEvents() {
		return populationEvents;
	}

	public void setPopulationEvents(List<PopulationEvent> populationEvents) {
		this.populationEvents = populationEvents;
	}

}
