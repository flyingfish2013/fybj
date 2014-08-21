package code.main.bean.aop;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import code.main.bean.util.PropertiesUtil;

public class GlobalMessagesListener implements ServletContextListener {
	private Logger log = LoggerFactory.getLogger(GlobalMessagesListener.class);
	
	public void contextInitialized(ServletContextEvent arg0) {
		try {
			InputStream in = GlobalMessagesListener.class.getClassLoader().getResourceAsStream("services.properties");
			PropertiesUtil.prop.load(in);
		} catch (IOException e) {
			e.printStackTrace();
			log.error(e.getMessage());
		}
	}

	public void contextDestroyed(ServletContextEvent event) {

	}
}
