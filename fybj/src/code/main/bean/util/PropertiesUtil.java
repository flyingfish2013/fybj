package code.main.bean.util;

import java.util.Properties;

public class PropertiesUtil {
	public static Properties prop = new Properties();
	
	public static String getProp(String key) {
		return prop.getProperty(key);
	}
}
