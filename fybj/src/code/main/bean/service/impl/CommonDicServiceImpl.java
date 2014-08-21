package code.main.bean.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import code.main.bean.dao.CommonDicDao;
import code.main.bean.domain.Page;
import code.main.bean.entity.CommonDic;
import code.main.bean.service.CommonDicService;

@Service("commonDicService")
@Transactional
public class CommonDicServiceImpl implements CommonDicService {
	
	@SuppressWarnings("unchecked")
	Map m = new HashMap();
	@Resource(name="commonDicDao")
	private CommonDicDao commonDicDao;
	
	@SuppressWarnings("unchecked")
	public Map add(CommonDic temp) {
		CommonDic tmp = commonDicDao.findObject("from CommonDic where type=? and name=?", temp.getType(),temp.getName());
		if(tmp == null){
			int id = (Integer) commonDicDao.addReturn(temp);
			m.put("flag", true);
			m.put("msg", id);
		}else{
			m.put("flag", false);
			m.put("msg", "添加失败,当前字典信息已经存在!");
		}
		return m;
	}

	@SuppressWarnings("unchecked")
	public Map update(CommonDic temp) {
		CommonDic tmp = commonDicDao.findObject("from CommonDic where type=? and name=? and id <> ?", temp.getType(),temp.getName(),temp.getId());
		if(tmp == null){
			commonDicDao.update(temp);
			m.put("flag", true);
			m.put("msg", temp.getId());
		}else{
			m.put("flag", false);
			m.put("msg", "修改失败,当前字典信息已经存在!");
		}
		return m;
	}

	@SuppressWarnings("unchecked")
	public List findByType(String type) {
		String hql = "from CommonDic where type=?";
		return commonDicDao.findList(hql, type);
	}

	public CommonDic find(Integer id, boolean lazy) {
		if(lazy){
			return commonDicDao.load(CommonDic.class, id);
		}else{
			return commonDicDao.get(CommonDic.class, id);
		}
	}

	public Page findPage(String type, String name) {
		String where = "where 1=1";
		if(type!=null && !type.isEmpty()){
			where += " and t.type like '%"+type+"%'"; 
		}
		if(name!=null && !name.isEmpty()){
			where += " and t.name like '%"+name+"%'"; 
		}
		String hql = "from CommonDic t "+where+" order by t.type asc";
		return commonDicDao.findExtPage(hql);
	}
	
	@SuppressWarnings("unchecked")
	public List findTypes() {
		String hql = "select distinct(t.type) from CommonDic t order by t.type asc";
		List lit = commonDicDao.findList(hql);
		List list = new ArrayList();
		for (int i = 0; i < lit.size(); i++) {
			Map m = new HashMap();
			m.put("typename", lit.get(i));
			list.add(m);
		}
		return list;
	}
	
	@SuppressWarnings("unchecked")
	public Map del(String ids) {
		return null;
	}

}
