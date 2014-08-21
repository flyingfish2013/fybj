package code.main.bean.service;

import java.util.List;
import java.util.Map;

import code.main.bean.domain.Page;
import code.main.bean.entity.CommonDic;

public interface CommonDicService {

	@SuppressWarnings("unchecked")
	Map add(CommonDic temp);

	@SuppressWarnings("unchecked")
	List findByType(String type);
	
	@SuppressWarnings("unchecked")
	List findTypes();
	
	Page findPage(String type,String name);
	
	CommonDic find(Integer id, boolean lazy);
	
	@SuppressWarnings("unchecked")
	Map del(String ids);
	
	@SuppressWarnings("unchecked")
	Map update(CommonDic temp);
}