package code.main.bean.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import code.main.bean.domain.Page;

public interface LogManagerService {

	Page findPage(String beginTime,String endTime,String operate,String username);
	
	void add(String clazzName,HttpServletRequest request);

	@SuppressWarnings("unchecked")
	Map delete(String ids);
	
	@SuppressWarnings("unchecked")
	Map batchDelete(String beginTime,String endTime,String operate);
}