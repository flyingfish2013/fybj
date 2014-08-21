package code.main.bean.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import code.main.bean.dao.InfoDoctorDao;
import code.main.bean.domain.Page;
import code.main.bean.entity.InfoDoctor;
import code.main.bean.service.DoctorService;

@Service("doctorService")
@Transactional
public class DoctorServiceImpl implements DoctorService {
	
	@SuppressWarnings("unchecked")
	Map m = new HashMap();
	@Resource(name="infoDoctorDao")
	private InfoDoctorDao infoDoctorDao;
	
	public Page findPage(String field,String keyword) {
		String hql = "from InfoDoctor ";
		if(field!=null && !field.isEmpty() && keyword!=null && !keyword.isEmpty()){
			if(field.equals("hospital")){
				hql += " where hospital.name like '%"+keyword+"%'";
			}else if(field.equals("station")){
				hql += " where station.name like '%"+keyword+"%'";
			}else{
				hql += " where "+field+" like '%"+keyword+"%'";
			}
		}
		hql += " order by id";
		return infoDoctorDao.findExtPage(hql);
	}
	
	@SuppressWarnings("unchecked")
	public Map update(InfoDoctor item) {
		try {
			infoDoctorDao.update(item);
			m.put("flag", true);
		} catch (Exception e) {
			e.printStackTrace();
			m.put("flag", false);
		}
		return m;
	}
	
	public InfoDoctor find(Integer id, boolean lazy) {
		if(lazy){
			return infoDoctorDao.load(InfoDoctor.class, id);
		}else{
			return infoDoctorDao.get(InfoDoctor.class, id);
		}
	}
	
	@SuppressWarnings("unchecked")
	public Map delete(String ids) {
		try {
			//医生信息
			String hql = "delete from InfoDoctor where id in("+ids+")";
			infoDoctorDao.doHql(hql);
			m.put("flag", true);
		} catch (Exception e) {
			e.printStackTrace();
			m.put("flag", false);
		}
		return m;
	}
	
	@SuppressWarnings("unchecked")
	public void deleteByHospitalId(String hids) {
		String hql = "select id from InfoDoctor where hospital.id in("+hids+")";
		List lit = infoDoctorDao.findList(hql);
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
