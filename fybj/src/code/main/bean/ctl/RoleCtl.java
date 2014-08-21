package code.main.bean.ctl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import code.main.bean.domain.Page;
import code.main.bean.entity.CommRole;
import code.main.bean.service.RoleService;

@Controller
@RequestMapping("/role")
public class RoleCtl {
	
	@Resource(name="roleService")
	private RoleService roleService;
	
	@RequestMapping("list")
	public @ResponseBody Page list(HttpServletRequest request){
		String roleName = request.getParameter("roleName");
		return roleService.findPage(roleName);
	}
	
	@RequestMapping("findAll")
	public @ResponseBody List<CommRole> findALl(){
		return roleService.findAll();
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("add")
	public @ResponseBody Map add(HttpServletRequest request){
		String roleName = request.getParameter("roleName");
		String remark = request.getParameter("remark");
		return roleService.add(roleName,remark);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("update")
	public @ResponseBody Map update(HttpServletRequest request){
		String id = request.getParameter("id");
		String roleName = request.getParameter("roleName");
		String remark = request.getParameter("remark");
		return roleService.update(id,roleName,remark);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("delete")
	public @ResponseBody Map delete(HttpServletRequest request){
		String ids = request.getParameter("ids");
		return roleService.delete(ids);
	}
}
