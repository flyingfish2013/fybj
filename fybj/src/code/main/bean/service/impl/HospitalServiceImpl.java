package code.main.bean.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import code.main.bean.dao.HospitalDao;
import code.main.bean.domain.Page;
import code.main.bean.entity.Hospital;
import code.main.bean.service.DoctorService;
import code.main.bean.service.HospitalService;
import code.main.bean.service.OrgService;

@Service("hospitalService")
@Transactional
public class HospitalServiceImpl implements HospitalService {
	private Logger log = LoggerFactory.getLogger(HospitalServiceImpl.class);
	
	@SuppressWarnings("unchecked")
	Map m = new HashMap();
	@Resource(name="hospitalDao")
	private HospitalDao hospitalDao;
	
	@Resource(name="orgService")
	private OrgService orgService;
	
	@Resource(name="doctorService")
	private DoctorService doctorService;
	
	@SuppressWarnings("unchecked")
	public Map add(Hospital h) {
		Hospital tmp = hospitalDao.findObject("from Hospital where name=? and region.id=?", h.getName(),h.getRegion().getId());
		if(tmp == null){
			hospitalDao.add(h);
			m.put("flag", true);
			m.put("msg", "添加成功!");
		}else{
			m.put("flag", false);
			m.put("msg", "添加失败,当前地区下的"+h.getName()+"已存在!");
		}
		return m;
	}
	
	@SuppressWarnings("unchecked")
	public Map update(Hospital h) {
		Hospital tmp = hospitalDao.findObject("from Hospital where name=? and region.id=? and id <> ?", h.getName(),h.getRegion().getId(),h.getId());
		if(tmp == null){
			hospitalDao.update(h);
			m.put("flag", true);
			m.put("msg", "修改成功!");
		}else{
			m.put("flag", false);
			m.put("msg", "修改失败,当前地区下的"+h.getName()+"已存在!");
		}
		return m;
	}
	
	@SuppressWarnings("unchecked")
	public Page findPage(String name,String code) {
		String hql = "from Hospital  where 1=1 ";
		if(name != null && !name.isEmpty()){
			hql += " and name like '%"+name+"%'";
		}
		if(code !=null && !code.isEmpty()){
			hql += " and region.code like '"+code+"%'";
		}
		hql += " order by id";
		log.info(hql);
		Page page = null;
		try {
			page = hospitalDao.findExtPage(hql);
			List list = page.getDatas();
			List l = new ArrayList();
			for (int i = 0; i < list.size(); i++) {
				Map m = new HashMap();
				Hospital h = (Hospital) list.get(i);
				String pcode = h.getRegion().getPcode();
				String address = orgService.findAddress(pcode,h.getRegion().getText());
				m.put("address", address);
				m.put("id", h.getId());
				m.put("name", h.getName());
				m.put("supe", h.getSupe());
				m.put("tel", h.getTel());
				m.put("email", h.getEmail());
				m.put("rid", h.getRegion().getId());
				m.put("rname", h.getRegion().getText());
				m.put("nid", h.getNature().getId());
				m.put("nname", h.getNature().getName());
				m.put("lid", h.getLevel().getId());
				m.put("lname", h.getLevel().getName());
				l.add(m);
			}
			page.setDatas(l);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return page;
	}
	
	public Hospital find(Integer id, boolean lazy) {
		if(lazy){
			return hospitalDao.load(Hospital.class, id);
		}else{
			return hospitalDao.get(Hospital.class, id);
		}
	}
	
	@SuppressWarnings("unchecked")
	public Map delete(String ids) {
		try {
			//医生信息
			doctorService.deleteByHospitalId(ids);
			//妇幼保健院信息
			String hql = "delete from Hospital where id in("+ids+")";
			hospitalDao.doHql(hql);
			m.put("flag", true);
		} catch (Exception e) {
			e.printStackTrace();
			m.put("flag", false);
		}
		return m;
	}
	
	@SuppressWarnings("unchecked")
	public void deleteByOrgId(String oids){
		String hql = "select id from Hospital where region.id in("+oids+")";
		List lit = hospitalDao.findList(hql);
		if(lit!=null && lit.size()>0 ){
			String idstr = "";
			for (int i = 0; i < lit.size(); i++) {
				idstr += ','+lit.get(i).toString();
			}
			String ids = idstr.substring(1);
			this.delete(ids);
		}
	}
}
