package code.main.bean.ctl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import code.main.bean.service.ModuleService;

@Controller
@RequestMapping("/module")
public class ModuleCtl {
	
	@Resource(name="moduleService")
	private ModuleService moduleService;
	
	@SuppressWarnings("unchecked")
	@RequestMapping("findTree")
	public @ResponseBody List listTree(@RequestParam String node){
		return moduleService.listTree(node);
	}

	@SuppressWarnings("unchecked")
	@RequestMapping("findAll")
	public @ResponseBody List listAll(){
		return moduleService.listAll();
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("add")
	public @ResponseBody Map add(HttpServletRequest request){
		String pid = request.getParameter("pid");
		String scn = request.getParameter("scn");
		String text = request.getParameter("text");
		return moduleService.add(pid, scn, text);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("update")
	public @ResponseBody Map update(HttpServletRequest request){
		String id = request.getParameter("id");
		String scn = request.getParameter("scn");
		String text = request.getParameter("text");
		return moduleService.update(id, scn, text);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("delete")
	public @ResponseBody Map delete(HttpServletRequest request){
		String id = request.getParameter("id");
		return moduleService.delete(id);
	}
}
