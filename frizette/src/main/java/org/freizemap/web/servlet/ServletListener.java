package org.freizemap.web.servlet;

import java.io.IOException;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.log4j.Logger;
import org.freizemap.service.DBPediaService;
import org.freizemap.web.ConstantesWeb;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class ServletListener implements ServletContextListener {

	private final static Logger LOG = Logger.getLogger(ServletListener.class);

	public void contextInitialized(ServletContextEvent arg0) {
		AbstractApplicationContext context = new ClassPathXmlApplicationContext(
				ConstantesWeb.ClassPathXmlApplicationContext.getValue());
		arg0.getServletContext().setAttribute(
				ConstantesWeb.ClassPathXmlApplicationContext.name(), context);

		DBPediaService dBPediaService = context.getBean(DBPediaService.class);

		try {
			dBPediaService.initResourceDBPedia();
		} catch (IOException e) {
			LOG.error("Fail to get DPPedia resources", e);
		}
	}

	public void contextDestroyed(ServletContextEvent arg0) {

	}

}
