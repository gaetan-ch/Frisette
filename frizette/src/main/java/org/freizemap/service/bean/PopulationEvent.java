package org.freizemap.service.bean;

import com.google.common.base.Objects.ToStringHelper;

public class PopulationEvent extends PositionEvent {
	
	public String TYPE_POPULATION_EVENT = "TypePopulationEvent";

	private static final long serialVersionUID = 1L;

	
	private String population;

	public PopulationEvent(){
		super.setType(TYPE_POPULATION_EVENT);
	}

		public String getPopulation() {
		return population;
	}

	public void setPopulation(String population) {
		this.population = population;
	}

	/**
	 * override to add properties to the stream
	 * @param helper helper
	 * @return
	 */
	protected ToStringHelper addProperties(ToStringHelper helper){
		return super.addProperties(helper).add("population", this.population);
		
	}


}
