package code.main.bean.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import code.main.bean.dao.CommACLDao;
import code.main.bean.dao.CommModuleDao;
import code.main.bean.dao.CommUserRoleDao;
import code.main.bean.entity.CommACL;
import code.main.bean.entity.CommModule;
import code.main.bean.entity.CommRole;
import code.main.bean.entity.CommUserRole;
import code.main.bean.service.AclService;
import code.main.bean.util.ParamsFilter;

@Service("aclService")
@Transactional
public class AclServiceImpl implements AclService {
	
	@SuppressWarnings("unchecked")
	HashMap m = new HashMap();

	@Resource(name="aclDao")
	private CommACLDao aclDao;
	
	@Resource(name="urDao")
	private CommUserRoleDao urDao;
	
	@Resource(name="moduleDao")
	private CommModuleDao moduleDao;
	
	public List<CommACL> findByRole(int roleId){
		String hql = "from CommACL acl where acl.principalType = ? and acl.principalId = ?";
		List<CommACL> list = aclDao.findList(hql, "role", roleId);
		return list;
	}
	
	public List<CommACL> findByUser(int userId) {
		String hql = "from CommACL acl where acl.principalType = ? and acl.principalId = ?";
		List<CommACL> list = aclDao.findList(hql, "user", userId);
		return list;
	}

	@SuppressWarnings({ "unchecked"})
	public Map AddAcl(String principalType, int principalId, String mids) {
		// 找到原来已经授权的
		List<CommACL>  acls = aclDao.findList("from CommACL acl where acl.principalType = ? and acl.principalId = ?", principalType, principalId);
		List<CommACL> nows = new ArrayList<CommACL>();
		// 前台传递的需要获取的
		String[] midArr = mids.split(",");
		for (int i = 0; i < midArr.length; i++) {
			int mid = ParamsFilter.converterToInt(midArr[i]);
			if(mid != 0){
				CommACL nowObj = new CommACL(principalType, principalId, mid);
				nows.add(nowObj);
			}
		}
		// 需要删除的
		List<CommACL> dels = diff(acls, nows);
		for (CommACL commACL : dels) {
			aclDao.del(commACL);
		}
		// 需要添加的
		List<CommACL> adds = diff(nows, acls);
		for (CommACL commACL : adds) {
			aclDao.add(commACL);
		}
		m.put("flag", true);
		m.put("msg", "授权成功");
		return m;
	}
	
	private List<CommACL> diff(List<CommACL> list1, List<CommACL> list2){
		List<CommACL> list = new ArrayList<CommACL>();
		for (int i = 0; i < list1.size(); i++) {
			CommACL acl = list1.get(i);
			if(!list2.contains(acl)){
				list.add(acl);
			}
		}
		return list;
	}

	
	@SuppressWarnings({"unchecked" })
	public List<String> findAclByUser(int userId) {
		try {
			List<String> ll = new ArrayList<String>();
			Map result = new HashMap();
			//查找用户的模块权限
			String byUser = "select acl.id, acl.sysModuleId from CommACL acl where acl.principalType = ? and acl.principalId = ?";
			List _userAcl = aclDao.findList(byUser, "user", userId);
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
				byRole = "select acl.id, acl.sysModuleId from CommACL acl where acl.principalType = ? and acl.principalId = ?";
				_roleAcl = aclDao.findList(byRole, "role", role.getId());
				for (Object object : _roleAcl) {
					Object[] arr = (Object[])object;
					result.put(arr[1], arr[0]);
				}
			}
			Set coll = result.keySet();
			for (Object object : coll) {
				int moduleId = (Integer)object;
				CommModule m = moduleDao.get(CommModule.class, moduleId);
				ll.add("'"+m.getScn()+"'");
			}
			return ll;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}
