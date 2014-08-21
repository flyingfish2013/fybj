package code.main.bean.util;

import java.util.List;

import javax.servlet.http.HttpSession;

import code.main.bean.aop.InterceptorContext;

public class SessionUtil {

	@SuppressWarnings("unchecked")
	public static List<Integer> getAclds(){
		HttpSession session = InterceptorContext.getSession();
		List<Integer> aclds = (List<Integer>) session.getAttribute("aclds");
		return aclds;
	}
	
	@SuppressWarnings("unchecked")
	public static List<String> getAcls(){
		HttpSession session = InterceptorContext.getSession();
		List<String> acls = (List<String>) session.getAttribute("acls");
		return acls;
	}
	
	@SuppressWarnings("unchecked")
	public static String aclds(){
		HttpSession session = InterceptorContext.getSession();
		List<Integer> aclds = (List<Integer>) session.getAttribute("aclds");
		if(aclds.size()==0){return "";}
		String sids = "";
		for (Integer i : aclds) {
			sids += ","+i;
		}
		return sids.substring(1);
	}
	
	@SuppressWarnings("unchecked")
	public static String acls(){
		HttpSession session = InterceptorContext.getSession();
		List<String> acls = (List<String>) session.getAttribute("acls");
		if(acls.size()==0){return "";}
		String sids = "";
		for (String s : acls) {
			sids += ","+s;
		}
		return sids.substring(1);
	}
}
