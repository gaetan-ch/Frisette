package org.freizemap.service.bean;

import java.util.Date;

public class TimePeriod {

	private Date startPeriod;
	private Date endPeriod;

	public TimePeriod(Date startPeriod, Date endPeriod) {
		super();
		this.startPeriod = startPeriod;
		this.endPeriod = endPeriod;
	}

	public Date getStartPeriod() {
		return startPeriod;
	}

	public void setStartPeriod(Date startPeriod) {
		this.startPeriod = startPeriod;
	}

	public Date getEndPeriod() {
		return endPeriod;
	}

	public void setEndPeriod(Date endPeriod) {
		this.endPeriod = endPeriod;
	}

}
