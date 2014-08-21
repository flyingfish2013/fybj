package code.main.bean.service;

import java.util.List;
import java.util.Map;

import code.main.bean.entity.CommUserRole;

public interface UserRoleService {

	List<CommUserRole> findByUser(int userId);

	@SuppressWarnings("unchecked")
	Map add(int userId, String rids);

}