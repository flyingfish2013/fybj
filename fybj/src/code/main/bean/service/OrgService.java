package code.main.bean.service;

import java.util.List;
import java.util.Map;

import code.main.bean.entity.RegionDic;

public interface OrgService {

	@SuppressWarnings("unchecked")
	Map add(RegionDic org);

	@SuppressWarnings("unchecked")
	List listOrgTree(String pcode);
	
	@SuppressWarnings("unchecked")
	List listOrgTree2(String pcode);
	
	String findAddress(String pcode,String result);
	
	String findChildIds(String code,String result);
	
	RegionDic find(Integer id, boolean lazy);
	
	@SuppressWarnings("unchecked")
	Map delete(String id,String code);
	
	@SuppressWarnings("unchecked")
	Map update(RegionDic org);
}