package code.main.bean.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import code.main.bean.dao.CommRoleDao;
import code.main.bean.dao.CommUserDao;
import code.main.bean.dao.CommUserRoleDao;
import code.main.bean.entity.CommRole;
import code.main.bean.entity.CommUser;
import code.main.bean.entity.CommUserRole;
import code.main.bean.service.UserRoleService;
import code.main.bean.util.ParamsFilter;

@Service("urService")
@Transactional
public class UserRoleServiceImpl implements UserRoleService {

	@SuppressWarnings("unchecked")
	HashMap m = new HashMap();
	
	@Resource(name="urDao")
	private CommUserRoleDao urDao;
	
	@Resource(name="userDao")
	private CommUserDao userDao;
	
	@Resource(name="roleDao")
	private CommRoleDao roleDao;
	
	public List<CommUserRole> findByUser(int userId){
		List<CommUserRole> urs = urDao.findList("from CommUserRole ur where ur.user.id = ?",userId);
		return urs;
	}

	@SuppressWarnings({"unchecked" })
	public Map add(int userId, String rids) {
		try {
			List l = urDao.findList("select ur.role.id from CommUserRole ur where ur.user.id = ?", userId);
			String[] nowsArr = rids.split(",");
			List nows = strToList(nowsArr);
			List dels = diff(l, nows);
			List adds = diff(nows, l);
			for (int i = 0; i < dels.size(); i++) {
				urDao.doHql("delete from CommUserRole ur where ur.user.id = ? and ur.role.id = ?", userId, dels.get(i));
			}
			if(adds.size() > 0){
				CommUser user = userDao.get(CommUser.class, userId);
				for (int i = 0; i < adds.size(); i++) {
					int roleId = (Integer)adds.get(i);
					CommUserRole ur = new CommUserRole();
					CommRole role = roleDao.get(CommRole.class, roleId);
					ur.setRole(role);
					ur.setUser(user);
					urDao.add(ur);
				}
			}
			m.put("flag", true);
			m.put("msg", "分配角色成功!");
		} catch (Exception e) {
			e.printStackTrace();
			m.put("flag", true);
			m.put("msg", "分配角色失败!");
		}
		return m;
	}
	
	@SuppressWarnings({"unchecked" })
	private List strToList(String[] arr){
		List l = new ArrayList();
		for (int i = 0; i < arr.length; i++) {
			if(arr[i] != null && !arr[i].isEmpty()){
				l.add(ParamsFilter.converterToInt(arr[i]));
			}
		}
		return l;
	}	
	
	@SuppressWarnings({"unchecked" })
	private List diff(List list1, List list2){
		List list = new ArrayList();
		for (int i = 0; i < list1.size(); i++) {
			Object acl = list1.get(i);
			if(!list2.contains(acl)){
				list.add(acl);
			}
		}
		return list;
	}
}
