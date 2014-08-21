package code.main.bean.service;

import java.util.Map;

import code.main.bean.domain.Page;
import code.main.bean.entity.InfoDoctor;

public interface DoctorService {

	Page findPage(String field,String keyword);
	
	InfoDoctor find(Integer id, boolean lazy);
	
	@SuppressWarnings("unchecked")
	Map delete(String ids);
	
	void deleteByHospitalId(String hids);
	
	@SuppressWarnings("unchecked")
	Map update(InfoDoctor item);
}