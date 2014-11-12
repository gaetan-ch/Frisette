package org.freizemap.web.servlet.base;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;

import org.freizemap.web.ConstantesWeb;
import org.springframework.context.support.AbstractApplicationContext;

public abstract class FreizeMapServlet extends HttpServlet {
	
	public AbstractApplicationContext getAbstractApplicationContext(HttpServletRequest request){		
		return (AbstractApplicationContext) request.getSession().getServletContext().getAttribute(
				ConstantesWeb.ClassPathXmlApplicationContext.name());

	}
}
