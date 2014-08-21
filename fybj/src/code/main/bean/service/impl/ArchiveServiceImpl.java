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
import code.main.bean.dao.CommArchiveDao;
import code.main.bean.dao.CommUserDao;
import code.main.bean.dao.CommUserRoleDao;
import code.main.bean.dao.InfoDoctorDao;
import code.main.bean.domain.Page;
import code.main.bean.entity.CommArchive;
import code.main.bean.entity.CommUser;
import code.main.bean.entity.Hospital;
import code.main.bean.entity.InfoDoctor;
import code.main.bean.service.AclService;
import code.main.bean.service.AcldService;
import code.main.bean.service.ArchiveService;
import code.main.bean.service.OrgService;
import code.main.bean.service.UserService;

@Service("archiveService")
public class ArchiveServiceImpl implements ArchiveService {
	
	@SuppressWarnings("unchecked")
	Map m = new HashMap();
	@Resource(name="userDao")
	private CommUserDao commonUserDao; 
	
	@Resource(name = "commArchiveDao")
	private CommArchiveDao commArchiveDao;
	
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
	@Transactional
	public Map add(CommArchive archive) {
		commArchiveDao.add(archive);
		m.put("flag", true);
		return m;
	}
	
	@SuppressWarnings("unchecked")
	@Transactional
	public Map update(CommArchive archive) {
		commArchiveDao.update(archive);
		m.put("flag", true);
		return m;
	}

	@SuppressWarnings("unchecked")
	@Transactional
	public Map delete(String ids) {
		try {
			String hql1 = "delete from CommArchive where id in ("+ids+")";
			commArchiveDao.doHql(hql1);
			m.put("flag", true);
		} catch (Exception e) {
			e.printStackTrace();
			m.put("flag", false);
		}
		return m;
	}

    @Override
    public List<CommArchive> findList(String ids) {
        String hql = "from CommArchive where id in ("+ids+")";
        return commArchiveDao.findList(hql);
    }

    @SuppressWarnings("unchecked")
	public Page findPage(String field,String keyword) {
		String hql = "from CommArchive ";
		if(keyword != null && !keyword.isEmpty()){
			hql += " where "+field+" like '%"+keyword+"%'";
		}
		hql += " order by id";
		Page page = commArchiveDao.findExtPage(hql);
		return page;
	}
}
