package code.main.bean.ctl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import code.main.bean.entity.RegionDic;
import code.main.bean.service.OrgService;
import code.main.bean.util.ParamsFilter;

@Controller
@RequestMapping("/org")
public class OrgCtl {
	
	@Resource(name="orgService")
	private OrgService orgService;
	
	@SuppressWarnings("unchecked")
	@RequestMapping("findOrgTree")
	public @ResponseBody List listOrgTree(@RequestParam String pcode){
		return orgService.listOrgTree(pcode);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("findOrgTree2")
	public @ResponseBody List listOrgTree2(@RequestParam String pcode){
		return orgService.listOrgTree2(pcode);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("add")
	public @ResponseBody Map add(HttpServletRequest request){
		RegionDic org = new RegionDic();
		org.setText(request.getParameter("text"));
		org.setCode(request.getParameter("code"));
		org.setLevel(ParamsFilter.converterToInt(request.getParameter("level")));
		org.setPcode(request.getParameter("pcode"));
		return orgService.add(org);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("update")
	public @ResponseBody Map update(HttpServletRequest request){
		RegionDic org = new RegionDic();
		org.setText(request.getParameter("text"));
		org.setCode(request.getParameter("code"));
		org.setLevel(ParamsFilter.converterToInt(request.getParameter("level")));
		org.setId(ParamsFilter.converterToInt(request.getParameter("id")));
		org.setPcode(request.getParameter("pcode"));
		return orgService.update(org);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("delete")
	public @ResponseBody Map delete(HttpServletRequest request){
		String id = request.getParameter("id");
		String code = request.getParameter("code");
		return orgService.delete(id,code);
	}
}
