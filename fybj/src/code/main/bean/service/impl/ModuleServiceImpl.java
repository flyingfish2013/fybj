package code.main.bean.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import code.main.bean.dao.CommACLDao;
import code.main.bean.dao.CommModuleDao;
import code.main.bean.entity.CommModule;
import code.main.bean.service.ModuleService;
import code.main.bean.util.ParamsFilter;

@Service("moduleService")
@Transactional
public class ModuleServiceImpl implements ModuleService {

	@SuppressWarnings("unchecked")
	Map m = new HashMap();
	@Resource(name="moduleDao")
	private CommModuleDao moduleDao;
	
	@Resource(name="aclDao")
	private CommACLDao commACLDao;

	@SuppressWarnings("unchecked")
	public List listTree(String pid) {
		int pid_p = ParamsFilter.converterToInt(pid);
		String hql = "from CommModule t where t.pid="+pid_p+" order by t.id";
		List list = moduleDao.findList(hql);
		return list;
	}

	public CommModule find(Integer id, boolean lazy) {
		if(lazy){
			return moduleDao.load(CommModule.class, id);
		}else{
			return moduleDao.get(CommModule.class, id);
		}
	}

	@SuppressWarnings({ "unchecked"})
	public Map delete(String id) {
		try {
			//删除角色与模块的关系
			String hql0 = "select id from CommModule where pid="+id+" or id="+id;
			List lit = moduleDao.findList(hql0);
			if(lit!=null && lit.size()>0 ){
				String idstr = "";
				for (int i = 0; i < lit.size(); i++) {
					idstr += ','+lit.get(i).toString();
				}
				String ids = idstr.substring(1);
				String hql1 = "delete from CommACL where sysModuleId in ("+ids+")";
				commACLDao.doHql(hql1);
			}
			
			//删除pid=id的孩子节点
			String hql2 = "delete from CommModule where pid="+id;
			moduleDao.doHql(hql2);
			
			//删除当前节点
			String hql = "delete from CommModule where id="+id;
			moduleDao.doHql(hql);
			m.put("flag", true);
		} catch (Exception e) {
			e.printStackTrace();
			m.put("flag", false);
		}
		return m;
	}

	@SuppressWarnings({ "unchecked"})
	public Map add(String pid, String scn, String text) {
		int pid_p = ParamsFilter.converterToInt(pid);
		CommModule tmp = moduleDao.findObject("from CommModule where scn=?", scn);
		if(tmp == null){
			CommModule module = new CommModule(scn, text, true, pid_p);
			int id = (Integer) moduleDao.addReturn(module);
			if(pid_p > 0){
				CommModule parent = moduleDao.get(CommModule.class, pid_p);
				parent.setLeaf(false);
				moduleDao.update(parent);
			}
			m.put("flag", true);
			m.put("msg", id);
		}else{
			m.put("flag", false);
			m.put("msg", "添加失败,当前唯一标识已存在!");
		}
		return m;
	}

	@SuppressWarnings({ "unchecked"})
	public Map update(String id, String scn, String text) {
		int pk = ParamsFilter.converterToInt(id);
		CommModule tmp = moduleDao.findObject("from CommModule where scn = ? and id <> ?", scn, pk);
		if(tmp == null) {
			moduleDao.doHql("update CommModule set scn = ?, text = ? where id = ?", scn, text, pk);
			m.put("flag", true);
			m.put("msg", "修改成功!");
		}else{
			m.put("flag", false);
			m.put("msg", "修改失败,要修改的唯一标识已存在!");
		}
		return m;
	}

	@SuppressWarnings("unchecked")
	public List listAll() {
		List<CommModule> roots = moduleDao.findList("from CommModule m where m.pid = 0 order by m.id");
		return showTreeList(roots);
	}
	
	@SuppressWarnings({ "unchecked"})
	private List showTreeList(List<CommModule> list){
		List result = new ArrayList();
		for (int i = 0; i < list.size(); i++) {
			CommModule m = list.get(i);
			HashMap map = new HashMap();
			map.put("id", m.getId());
			map.put("text", m.getText());
			map.put("leaf", m.isLeaf());
			map.put("scn", m.getScn());
			map.put("pid", m.getPid());
			map.put("checked", false);
			if(!m.isLeaf()){
				List childs = this.listTree(String.valueOf(m.getId()));
				map.put("children", showTreeList(childs));
				map.put("expanded", true);
			}
			result.add(map);
		}
		return result;
	}
}