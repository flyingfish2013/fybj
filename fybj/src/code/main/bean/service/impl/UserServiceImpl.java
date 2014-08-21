package code.main.bean.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import code.main.bean.dao.CommACLDao;
import code.main.bean.dao.CommACLDataDao;
import code.main.bean.dao.CommUserDao;
import code.main.bean.dao.CommUserRoleDao;
import code.main.bean.dao.InfoDoctorDao;
import code.main.bean.domain.Page;
import code.main.bean.entity.CommUser;
import code.main.bean.entity.Hospital;
import code.main.bean.entity.InfoDoctor;
import code.main.bean.service.AclService;
import code.main.bean.service.AcldService;
import code.main.bean.service.OrgService;
import code.main.bean.service.UserService;

@Service("userService")
@Transactional(propagation=Propagation.REQUIRED,isolation=Isolation.READ_UNCOMMITTED)
public class UserServiceImpl implements UserService {
	
	@SuppressWarnings("unchecked")
	Map m = new HashMap();
	@Resource(name="userDao")
	private CommUserDao commonUserDao; 
	
	@Resource(name="infoDoctorDao")
	private InfoDoctorDao infoDoctorDao; 
	
	@Resource(name="aclDao")
	private CommACLDao commACLDao;
	
	@Resource(name="acldDao")
	private CommACLDataDao commACLDataDao;
	
	@Resource(name="urDao")
	private CommUserRoleDao commUserRoleDao;
	
	@Resource(name="acldService")
	private AcldService acldService;

	@Resource(name="aclService")
	private AclService aclService;
	
	@Resource(name="orgService")
	private OrgService orgService;
	
	@SuppressWarnings("unchecked")
	public Map add(CommUser user) {
		CommUser tmp = commonUserDao.findObject("from CommUser where username=?", user.getUsername());
		if(tmp == null){
			String userType = user.getUserType();
			if(userType.equals("医生")){
				InfoDoctor infoDoctor = new InfoDoctor();
				infoDoctor.setName(user.getUsername());
				int did = (Integer) infoDoctorDao.addReturn(infoDoctor);
				if(did!=0){
					List<InfoDoctor> dinfo = infoDoctorDao.findList("from InfoDoctor where id=?", did);
					user.setDinfo(dinfo);
					commonUserDao.add(user);
				}
			}else{
				commonUserDao.add(user);
			}
			m.put("flag", true);
		}else{
			m.put("flag", false);
			m.put("msg", "添加失败,当前用户名已存在!");
		}
		return m;
	}
	
	@SuppressWarnings("unchecked")
	public Map update(CommUser user) {
		CommUser tmp = commonUserDao.findObject("from CommUser where username=? and id <> ?", user.getUsername(),user.getId());
		if(tmp == null){
			CommUser cu = commonUserDao.load(CommUser.class, user.getId());
			user.setCreateTime(cu.getCreateTime());
			commonUserDao.update(user);
			m.put("flag", true);
		}else{
			m.put("flag", false);
			m.put("msg", "修改失败,当前用户名已存在!");
		}
		return m;
	}

	@SuppressWarnings("unchecked")
	public Map delete(String ids) {
		try {
			//删除用户与模块的关系
			String hql1 = "delete from CommACL where principalType='user' and principalId in ("+ids+")";
			commACLDao.doHql(hql1);
			
			//删除用户与数据的关系
			String hql2 = "delete from CommACLData where principalType='user' and principalId in ("+ids+")";
			commACLDataDao.doHql(hql2);
			
			//删除用户与角色的关系
			String hql3 = "delete from CommUserRole where user.id in("+ids+")";
			commUserRoleDao.doHql(hql3);
			
			//用户信息
			String hql = "delete from CommUser where id in("+ids+")";
			commonUserDao.doHql(hql);
			m.put("flag", true);
		} catch (Exception e) {
			e.printStackTrace();
			m.put("flag", false);
		}
		return m;
	}

	@SuppressWarnings("unchecked")
	public Map doLogin(String username, String password, String rand,HttpSession session) {
		String sessRand = (String) session.getAttribute("randCode");
		Map m = new HashMap();
		boolean flag = true;
		String msg = "";
		if(rand.equalsIgnoreCase(sessRand)){
			String hql = "from CommUser t where t.username=? and t.password=?";
			CommUser commonUser = commonUserDao.findObject(hql, username,password);
			if(commonUser != null){
				List<String> acls = aclService.findAclByUser(commonUser.getId());
				List<Integer> aclds = acldService.findAcldByUser(commonUser.getId());
				session.setAttribute("sessonUser", commonUser);
				session.setAttribute("acls", acls);
				session.setAttribute("aclds", aclds);
			}else{
				flag = false;
				msg = "用户名或密码不正确!";
			}
		}else{
			flag = false;
			msg = "验证码不正确!";
		}
		m.put("flag", flag);
		m.put("msg", msg);
		return m;
	}

	@SuppressWarnings("unchecked")
	public Page findPage(String field,String keyword) {
		String hql = "from CommUser ";
		if(keyword != null && !keyword.isEmpty()){
			hql += " where "+field+" like '%"+keyword+"%'";
		}
		hql += " order by id";
		Page page = commonUserDao.findExtPage(hql);
		List l = page.getDatas();
		List lit = new ArrayList();
		String pcode = "",address = "",txt = "",unit = "";
		for (int i=0;i<l.size();i++) {
			CommUser c = (CommUser) l.get(i);
			Map m = new HashMap();
			String userType = c.getUserType();
			if(userType.equals("医生")){
				List<InfoDoctor> infod = c.getDinfo();
				if(infod!=null && infod.size()>0){
					Hospital hos = infod.get(0).getHospital();
					if(hos!=null){
						pcode = hos.getRegion().getPcode();
						txt = hos.getRegion().getText();
						unit = hos.getName();
						address = orgService.findAddress(pcode,txt);
					}
				}
			}
			m.put("id", c.getId());
			m.put("username", c.getUsername());
			m.put("password", c.getPassword());
			m.put("userType", userType);
			m.put("createTime", c.getCreateTime());
			m.put("unit", unit);
			m.put("address", address);
			lit.add(m);
		}
		page.setDatas(lit);
		return page;
	}

}
