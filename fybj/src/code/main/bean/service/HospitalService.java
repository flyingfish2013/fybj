package code.main.bean.service;

import java.util.Map;

import code.main.bean.domain.Page;
import code.main.bean.entity.Hospital;

public interface HospitalService {

	@SuppressWarnings("unchecked")
	Map add(Hospital h);

	Page findPage(String name,String code);
	
	Hospital find(Integer id, boolean lazy);
	
	@SuppressWarnings("unchecked")
	Map delete(String ids);
	
	void deleteByOrgId(String oids);
	
	@SuppressWarnings("unchecked")
	Map update(Hospital h);
}