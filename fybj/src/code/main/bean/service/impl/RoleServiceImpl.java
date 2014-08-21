package code.main.bean.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import code.main.bean.dao.CommACLDao;
import code.main.bean.dao.CommACLDataDao;
import code.main.bean.dao.CommRoleDao;
import code.main.bean.dao.CommUserRoleDao;
import code.main.bean.domain.Page;
import code.main.bean.entity.CommRole;
import code.main.bean.service.RoleService;
import code.main.bean.util.ParamsFilter;

@Service("roleService")
@Transactional
public class RoleServiceImpl implements RoleService {
	
	@SuppressWarnings("unchecked")
	Map m = new HashMap();
	@Resource(name="roleDao")
	private CommRoleDao roleDao;
	
	@Resource(name="aclDao")
	private CommACLDao commACLDao;
	
	@Resource(name="acldDao")
	private CommACLDataDao commACLDataDao;
	
	@Resource(name="urDao")
	private CommUserRoleDao commUserRoleDao;

	@SuppressWarnings({ "unchecked"})
	public Map add(String roleName, String remark) {
		CommRole tmp = roleDao.findObject("from CommRole where roleName=?", roleName);
		if(tmp == null){
			CommRole role = new CommRole(roleName, remark);
			roleDao.add(role);
			m.put("flag", true);
			m.put("msg", "添加成功!");
		}else{
			m.put("flag", false);
			m.put("msg", "添加失败,当前角色名已存在!");
		}
		return m;
	}

	public Page findPage(String roleName) {
		String hql = "from CommRole";
		if(roleName != null && !roleName.isEmpty()){
			hql += " where roleName like '%"+roleName+"%'";
		}
		hql += " order by id";
		return roleDao.findExtPage(hql);
	}

	public CommRole find(Integer id, boolean lazy) {
		if(lazy){
			return roleDao.load(CommRole.class, id);
		}else{
			return roleDao.get(CommRole.class, id);
		}
	}

	@SuppressWarnings("unchecked")
	public Map delete(String ids) {
		try {
			//删除角色与模块的关系
			String hql1 = "delete from CommACL where principalType='role' and principalId in ("+ids+")";
			commACLDao.doHql(hql1);
			
			//删除角色与数据的关系
			String hql2 = "delete from CommACLData where principalType='role' and principalId in ("+ids+")";
			commACLDataDao.doHql(hql2);
			
			//删除用户与角色的关系
			String hql3 = "delete from CommUserRole where role.id in("+ids+")";
			commUserRoleDao.doHql(hql3);
			
			//角色信息
			String hql = "delete from CommRole where id in("+ids+")";
			roleDao.doHql(hql);
			m.put("flag", true);
		} catch (Exception e) {
			e.printStackTrace();
			m.put("flag", false);
		}
		return m;
	}

	@SuppressWarnings({ "unchecked"})
	public Map update(String id, String roleName, String remark) {
		int pk = ParamsFilter.converterToInt(id);
		CommRole tmp = roleDao.findObject("from CommRole where roleName = ? and id <> ?", roleName, pk);
		if(tmp == null){
			CommRole role = new CommRole(pk, roleName, remark);
			roleDao.update(role);
			m.put("flag", true);
			m.put("msg", "修改成功!");
		}else{
			m.put("flag", false);
			m.put("msg", "修改失败,要修改的角色名已存在!");
		}
		return m;
	}

	public List<CommRole> findAll() {
		return roleDao.findList("from CommRole r order by r.id");
	}


}
