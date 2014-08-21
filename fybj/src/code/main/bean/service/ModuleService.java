package code.main.bean.service;

import java.util.List;
import java.util.Map;

import code.main.bean.entity.CommModule;

public interface ModuleService {

	@SuppressWarnings("unchecked")
	List listTree(String pid);
	
	CommModule find(Integer id, boolean lazy);
	
	@SuppressWarnings("unchecked")
	Map delete(String id);
	
	@SuppressWarnings("unchecked")
	Map update(String id, String scn, String text);

	@SuppressWarnings("unchecked")
	Map add(String pid, String scn, String text);

	@SuppressWarnings("unchecked")
	List listAll();
}