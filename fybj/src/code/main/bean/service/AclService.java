package code.main.bean.service;

import java.util.List;
import java.util.Map;

import code.main.bean.entity.CommACL;

public interface AclService {

	public abstract List<CommACL> findByRole(int roleId);
	
	@SuppressWarnings("unchecked")
	public Map AddAcl(String principalType, int principalId, String mids);

	public abstract List<CommACL> findByUser(int userId);
	
	public List<String> findAclByUser(int userId);
}