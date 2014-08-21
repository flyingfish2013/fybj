package code.main.bean.service;

import java.util.List;
import java.util.Map;

import code.main.bean.domain.Page;
import code.main.bean.entity.CommRole;

public interface RoleService {

	@SuppressWarnings("unchecked")
	Map add(String roleName, String remark);

	Page findPage(String roleName);
	
	CommRole find(Integer id, boolean lazy);
	
	@SuppressWarnings("unchecked")
	Map delete(String ids);
	
	@SuppressWarnings("unchecked")
	Map update(String id, String roleName, String remark);

	List<CommRole> findAll();
}