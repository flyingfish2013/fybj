package code.main.bean.ctl;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import code.main.bean.domain.Page;
import code.main.bean.entity.CommonDic;
import code.main.bean.entity.Hospital;
import code.main.bean.entity.RegionDic;
import code.main.bean.service.CommonDicService;
import code.main.bean.service.HospitalService;
import code.main.bean.service.OrgService;
import code.main.bean.util.ParamsFilter;

@Controller
@RequestMapping("/hospital")
public class HospitalCtl {
	
	@Resource(name="hospitalService")
	private HospitalService hospitalService;
	
	@Resource(name="orgService")
	private OrgService orgService;
	
	@Resource(name="commonDicService")
	private CommonDicService commonDicService;
	
	@RequestMapping("list")
	public @ResponseBody Page list(HttpServletRequest request){
		String name = request.getParameter("name");
		String code = request.getParameter("code");
		return hospitalService.findPage(name, code);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("add")
	public @ResponseBody Map add(HttpServletRequest request){
		int rid = ParamsFilter.converterToInt(request.getParameter("rid"));
		int nid = ParamsFilter.converterToInt(request.getParameter("nid"));
		int lid = ParamsFilter.converterToInt(request.getParameter("lid"));
		RegionDic region = orgService.find(rid, true);
		CommonDic nature = commonDicService.find(nid, true);
		CommonDic level = commonDicService.find(lid, true);
		Hospital h = new Hospital();
		h.setName(request.getParameter("name"));
		h.setEmail(request.getParameter("email"));
		h.setSupe(request.getParameter("supe"));
		h.setTel(request.getParameter("tel"));
		h.setRegion(region);
		h.setNature(nature);
		h.setLevel(level);
		return hospitalService.add(h);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("update")
	public @ResponseBody Map update(HttpServletRequest request){
		int rid = ParamsFilter.converterToInt(request.getParameter("rid"));
		int nid = ParamsFilter.converterToInt(request.getParameter("nid"));
		int lid = ParamsFilter.converterToInt(request.getParameter("lid"));
		int id = ParamsFilter.converterToInt(request.getParameter("id"));
		RegionDic region = orgService.find(rid, true);
		CommonDic nature = commonDicService.find(nid, true);
		CommonDic level = commonDicService.find(lid, true);
		Hospital h = new Hospital();
		h.setId(id);
		h.setName(request.getParameter("name"));
		h.setEmail(request.getParameter("email"));
		h.setSupe(request.getParameter("supe"));
		h.setTel(request.getParameter("tel"));
		h.setRegion(region);
		h.setNature(nature);
		h.setLevel(level);
		return hospitalService.update(h);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("delete")
	public @ResponseBody Map delete(HttpServletRequest request){
		String ids = request.getParameter("ids");
		return hospitalService.delete(ids);
	}
}
