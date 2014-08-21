package code.main.bean.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import code.main.bean.aop.LogConstant;
import code.main.bean.dao.LogManagerDao;
import code.main.bean.domain.Page;
import code.main.bean.entity.CommUser;
import code.main.bean.entity.Hospital;
import code.main.bean.entity.InfoDoctor;
import code.main.bean.entity.LogManager;
import code.main.bean.service.LogManagerService;
import code.main.bean.service.OrgService;
import code.main.bean.util.DateTimeUtils;
import code.main.bean.util.IPUtil;

@Service("logManagerService")
@Transactional
public class LogManagerServiceImpl implements LogManagerService {
	
	@SuppressWarnings("unchecked")
	HashMap m = new HashMap();

	@Resource(name="logManagerDao")
	private LogManagerDao logManagerDao;
	
	@Resource(name="orgService")
	private OrgService orgService;

	public void add(String clazzName,HttpServletRequest request) {
		String operate = LogConstant.getClassName(clazzName);
		HttpSession session = request.getSession();
		CommUser user = (CommUser) session.getAttribute("sessonUser");
		if(operate!=null && user!=null){
			String ip = IPUtil.getIp(request);
			LogManager item = new LogManager();
			item.setIp(ip);
			item.setLogDate(DateTimeUtils.getNowTimeString());
			item.setUser(user);
			item.setOperate(operate);
			logManagerDao.add(item);
		}
	}

	@SuppressWarnings("unchecked")
	public Map batchDelete(String beginTime, String endTime, String operate) {
		try {
			String hql = "delete from LogManager where 1=1 ";
			if(beginTime!=null && !beginTime.isEmpty()){
				hql += " and logDate>='"+beginTime+"'";
			}
			if(endTime!=null && !endTime.isEmpty()){
				hql += " and logDate<=’"+endTime+"'";
			}
			if(operate!=null && !operate.isEmpty()){
				hql += " and operate like '%"+endTime+"%'";
			}
			logManagerDao.doHql(hql);
			m.put("flag", true);
		} catch (Exception e) {
			e.printStackTrace();
			m.put("flag", false);
		}
		return m;
	}

	@SuppressWarnings("unchecked")
	public Map delete(String ids) {
		try {
			String hql = "delete from LogManager where id in("+ids+")";
			logManagerDao.doHql(hql);
			m.put("flag", true);
		} catch (Exception e) {
			e.printStackTrace();
			m.put("flag", false);
		}
		return m;
	}

	@SuppressWarnings("unchecked")
	public Page findPage(String beginTime, String endTime, String operate,String username) {
		String hql = "from LogManager where 1=1 ";
		if(beginTime!=null && !beginTime.isEmpty()){
			hql += " and logDate>='"+beginTime+"'";
		}
		if(endTime!=null && !endTime.isEmpty()){
			hql += " and logDate<='"+endTime+"'";
		}
		if(operate!=null && !operate.isEmpty()){
			hql += " and operate like '%"+operate+"%'";
		}
		if(username!=null && !username.isEmpty()){
			hql += " and user.username like '%"+username+"%'";
		}
		try {
			Page page = logManagerDao.findExtPage(hql);
			List l = page.getDatas();
			List lit = new ArrayList();
			String pcode = "",address = "",txt = "",unit = "";
			for (int i=0;i<l.size();i++) {
				LogManager log = (LogManager) l.get(i);
				CommUser c = log.getUser();
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
				m.put("id", log.getId());
				m.put("logDate", log.getLogDate());
				m.put("operate", log.getOperate());
				m.put("ip", log.getIp());
				m.put("username", c.getUsername());
				m.put("userType", userType);
				m.put("unit", unit);
				m.put("address", address);
				lit.add(m);
			}
			page.setDatas(lit);
			return page;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}
