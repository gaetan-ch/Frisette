package org.freizemap.service.bean;

import java.io.Serializable;
import java.util.Date;

import com.google.common.base.Objects;
import com.google.common.base.Objects.ToStringHelper;

public abstract class EventFM implements Serializable {

	public final static String FORMAT_TIMESTAMP = "yyyy-MM-dd HH:mm";

	private static int ID = 1;

	private float longitude;

	private float latitude;

	private String timestamp;
	
	private String type;

	private Date timestampDate;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	public void setTimestampDate(Date timestampDate) {
		this.timestampDate = timestampDate;
	}

	public Date getTimestampDate() {
		return timestampDate;
	}

	public String getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(String timeStamp) {
		this.timestamp = timeStamp;
	}

	public float getLongitude() {
		return longitude;
	}

	public void setLongitude(float longitude) {
		this.longitude = longitude;
	}

	public float getLatitude() {
		return latitude;
	}

	public void setLatitude(float latitude) {
		this.latitude = latitude;
	}

	public String toString() {
		return addProperties(Objects.toStringHelper(this).omitNullValues())
				.toString();

	}

	/**
	 * override to add properties to the stream
	 * 
	 * @param helper
	 *            helper
	 * @return
	 */
	protected ToStringHelper addProperties(ToStringHelper helper) {
		return helper.add("timeStamp", this.timestamp)
				.add("longitude", this.longitude)
				.add("latitude", this.latitude);

	}

}
