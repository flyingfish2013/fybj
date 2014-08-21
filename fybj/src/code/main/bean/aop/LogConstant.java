package code.main.bean.aop;

import java.util.HashMap;
import java.util.Map;

public class LogConstant {

	public static Map<String, String> classMap;

	static{
		classMap = new HashMap<String, String>();
		classMap.put("ModuleCtl", "系统权限管理 -> 模块管理");
		classMap.put("OrgCtl", "系统权限管理 -> 地区管理");
		classMap.put("UserCtl", "系统权限管理 -> 用户管理");
		classMap.put("StudentCtl", "系统权限管理 -> 角色管理");
		classMap.put("LogManagerCtl", "系统权限管理 -> 日志管理");
		classMap.put("CommonDicCtl", "系统数据维护 -> 系统常用字典");
		classMap.put("DoctorCtl", "妇幼保健院管理 -> 医生管理");
		classMap.put("HospitalCtl", "妇幼保健院管理 -> 单位管理");
	}
	
	public static String getClassName(String key){
		String val = classMap.get(key);
		if(val!=null){
			return val;
		}else{
			return null;
		}
	}
}
