package org.freizemap.web;

public enum ConstantesWeb {


	
	ClassPathXmlApplicationContext("applicationContext.xml"),
	TIMELINER_JS_FORMAT("yyyy-MM-dd HH:mm:ss");
	
	private String value; 
	
	ConstantesWeb(String value){
		this.value = value;
	}
	public String getValue(){
		return this.value;
	}
	
}
