package code.main.bean.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import code.main.bean.dao.RegionDicDao;
import code.main.bean.entity.RegionDic;
import code.main.bean.service.HospitalService;
import code.main.bean.service.OrgService;

@Service("orgService")
@Transactional
public class OrgServiceImpl implements OrgService {

	@SuppressWarnings("unchecked")
	Map m = new HashMap();
	
	@Resource(name="regionDicDao")
	private RegionDicDao regionDicDao;
	
	@Resource(name="hospitalService")
	private HospitalService hospitalService;

	@SuppressWarnings("unchecked")
	public List listOrgTree(String pcode) {
		String hql = "from RegionDic t ";
		if(pcode!=null && !pcode.isEmpty() && !pcode.equals("root")){
			hql += " where t.pcode='"+pcode+"'"; 
		}else {
			hql += " where t.pcode is null or t.pcode=''"; 
		}
		hql += " order by t.code";
		List list = regionDicDao.findList(hql);
		return list;
	}
	
	@SuppressWarnings("unchecked")
	public List listOrgTree2(String pcode) {
		String hql = " from RegionDic t ";
		if(pcode!=null && !pcode.isEmpty() && !pcode.equals("root")){
			hql += " where t.pcode='"+pcode+"'"; 
		}else {
			hql += " where t.pcode is null or t.pcode=''"; 
		}
		hql += " order by t.code";
		List<RegionDic> list = regionDicDao.findList(hql);
		ArrayList result = new ArrayList();
		for (RegionDic rd : list) {
			Map m = new HashMap();
			m.put("id", rd.getCode());
			m.put("rid", rd.getId());
			m.put("pcode", rd.getPcode());
			m.put("text", rd.getText());
			m.put("level", rd.getLevel());
			result.add(m);
		}
		return result;
	}

	public RegionDic find(Integer id, boolean lazy) {
		if(lazy){
			return regionDicDao.load(RegionDic.class, id);
		}else{
			return regionDicDao.get(RegionDic.class, id);
		}
	}

	@SuppressWarnings("unchecked")
	public Map add(RegionDic org) {
		RegionDic tmp = regionDicDao.findObject("from RegionDic where code=?", org.getCode());
		if(tmp == null){
			int id = (Integer) regionDicDao.addReturn(org);
			m.put("flag", true);
			m.put("msg", id);
		}else{
			m.put("flag", false);
			m.put("msg", "添加失败,当前机构代码已存在!");
		}
		return m;
	}

	@SuppressWarnings("unchecked")
	public Map update(RegionDic org) {
		RegionDic tmp = regionDicDao.findObject("from RegionDic where code=? and id <> ?", org.getCode(),org.getId());
		if(tmp == null){
			regionDicDao.update(org);
			m.put("flag", true);
			m.put("msg", org.getId());
		}else{
			m.put("flag", false);
			m.put("msg", "修改失败,当前机构代码已存在!");
		}
		return m;
	}

	public String findAddress(String pcode, String result) {
		if(pcode != null && !pcode.isEmpty()){
			String hql = "from RegionDic t where t.code=?";
			RegionDic parent = regionDicDao.findObject(hql, pcode);
			if(parent != null){
				result = findAddress(parent.getPcode(), parent.getText()+result);
			}
		}
		return result;
	}
	
	@SuppressWarnings("unchecked")
	public String findChildIds(String code, String result) {
		String ret = "";
		if(code != null && !code.isEmpty()){
			String hql = "from RegionDic t where t.code like '"+code+"%'";
			List list = regionDicDao.findList(hql);
			for (int i = 0; i < list.size(); i++) {
				RegionDic rd = (RegionDic) list.get(i);
				ret += rd.getId()+",";
			}
		}
		return ret+result;
	}
	
	@SuppressWarnings("unchecked")
	public Map delete(String id,String code) {
		try {
			String hql0 = "select id from RegionDic where pcode like '"+code+"%' or id="+id;
			List lit = regionDicDao.findList(hql0);
			if(lit!=null && lit.size()>0 ){
				String idstr = "";
				for (int i = 0; i < lit.size(); i++) {
					idstr += ','+lit.get(i).toString();
				}
				String ids = idstr.substring(1);
				hospitalService.deleteByOrgId(ids);
			}
			
			//删除pid=id的孩子节点
			String hql2 = "delete from RegionDic where pcode like '"+code+"%'";
			regionDicDao.doHql(hql2);
			
			//删除当前节点
			String hql = "delete from RegionDic where id="+id;
			regionDicDao.doHql(hql);
			m.put("flag", true);
		} catch (Exception e) {
			e.printStackTrace();
			m.put("flag", false);
		}
		return m;
	}
}
