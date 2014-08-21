package code.main.bean.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import code.main.bean.dao.CommACLDataDao;
import code.main.bean.dao.CommUserRoleDao;
import code.main.bean.entity.CommACLData;
import code.main.bean.entity.CommRole;
import code.main.bean.entity.CommUserRole;
import code.main.bean.service.AcldService;
import code.main.bean.util.ParamsFilter;

@Service("acldService")
@Transactional
public class AcldServiceImpl implements AcldService{
	
	@SuppressWarnings("unchecked")
	HashMap m = new HashMap();

	@Resource(name="acldDao")
	private CommACLDataDao acldDao;
	
	@Resource(name="urDao")
	private CommUserRoleDao urDao;
	
	@SuppressWarnings("unchecked")
	public List findColumnByRole(int roleId) {
		String hql = "select acl.regionData from CommACLData acl where acl.principalType = ? and acl.principalId = ?";
		List list = acldDao.findList(hql, "role", roleId);
		return list;
	}

	@SuppressWarnings("unchecked")
	public List findColumnByUser(int userId) {
		String hql = "select acl.regionData from CommACLData acl where acl.principalType = ? and acl.principalId = ?";
		List list = acldDao.findList(hql, "user", userId);
		return list;
	}
	
	public List<CommACLData> findByRole(int roleId){
		String hql = "from CommACLData acl where acl.principalType = ? and acl.principalId = ?";
		List<CommACLData> list = acldDao.findList(hql, "role", roleId);
		return list;
	}
	
	public List<CommACLData> findByUser(int userId) {
		String hql = "from CommACLData acl where acl.principalType = ? and acl.principalId = ?";
		List<CommACLData> list = acldDao.findList(hql, "user", userId);
		return list;
	}

	@SuppressWarnings({ "unchecked"})
	public Map addAcld(String principalType, int principalId, String mids) {
		String[] arr = mids.split(",");
		for (int i = 0; i < arr.length; i++) {
			String idStr = arr[i];
			String[] idArr = idStr.split("_");
			String has = idArr[0];
			int id = ParamsFilter.converterToInt(idArr[1]);
			String hql = "from CommACLData acl where acl.principalType = ? and acl.principalId = ? and acl.regionData = ?";
			CommACLData data = acldDao.findObject(hql, principalType, principalId, id);
			if(data != null){
				if(has.equals("n")){
					acldDao.del(data);
				}
			}else{
				if(has.equals("y")){
					acldDao.add(new CommACLData(principalType, principalId, id));
				}
			}
		}
		m.put("flag", true);
		m.put("msg", "授权成功");
		return m;
	}
	
	@SuppressWarnings({"unchecked" })
	public List<Integer> findAcldByUser(int userId) {
		try {
			List<Integer> ll = new ArrayList<Integer>();
			Map result = new HashMap();
			//查找用户的模块权限
			String byUser = "select acl.id, acl.regionData from CommACLData acl where acl.principalType = ? and acl.principalId = ?";
			List _userAcl = acldDao.findList(byUser, "user", userId);
			for (Object object : _userAcl) {
				Object[] arr = (Object[])object;
				result.put(arr[1], arr[0]);
			}
			// 查找用户角色具有的模块权限
			String byRole = "";
			List _roleAcl = null;
			List<CommUserRole> roles = urDao.findList("from CommUserRole ur where ur.user.id = ?", userId);
			for (CommUserRole commUserRole : roles) {
				CommRole role = commUserRole.getRole();
				byRole = "select acl.id, acl.regionData from CommACLData acl where acl.principalType = ? and acl.principalId = ?";
				_roleAcl = acldDao.findList(byRole, "role", role.getId());
				for (Object object : _roleAcl) {
					Object[] arr = (Object[])object;
					result.put(arr[1], arr[0]);
				}
			}
			Set coll = result.keySet();
			for (Object object : coll) {
				int regionDataId = (Integer)object;
				ll.add(regionDataId);
			}
			return ll;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}
