package code.main.bean.service;

import java.util.List;
import java.util.Map;

import code.main.bean.entity.CommACLData;

public interface AcldService {

	List<CommACLData> findByRole(int roleId);
	
	@SuppressWarnings("unchecked")
	List findColumnByRole(int roleId);

	@SuppressWarnings("unchecked")
	List findColumnByUser(int userId);
	
	List<CommACLData> findByUser(int userId);

	@SuppressWarnings("unchecked")
	Map addAcld(String principalType, int principalId, String mids);

	List<Integer> findAcldByUser(int userId);
}