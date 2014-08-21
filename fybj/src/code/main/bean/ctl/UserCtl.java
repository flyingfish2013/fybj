package code.main.bean.ctl;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import code.main.bean.domain.Page;
import code.main.bean.entity.CommUser;
import code.main.bean.service.UserService;
import code.main.bean.util.DateTimeUtils;
import code.main.bean.util.ParamsFilter;

@Controller
@RequestMapping("/user")
public class UserCtl {
	
	@Resource(name="userService")
	private UserService userService;
	
	@RequestMapping("list")
	public @ResponseBody Page list(HttpServletRequest request){
		String field = request.getParameter("field");
		String keyword = request.getParameter("keyword"); 
		Page page = userService.findPage(field, keyword);
		return page;
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("add")
	public @ResponseBody Map add(HttpServletRequest request){
		CommUser cu = new CommUser();
		cu.setCreateTime(DateTimeUtils.getNowTimeString());
		cu.setPassword(request.getParameter("password"));
		cu.setUsername(request.getParameter("username"));
		cu.setUserType(request.getParameter("userType"));
		return userService.add(cu);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("update")
	public @ResponseBody Map update(HttpServletRequest request){
		CommUser cu = new CommUser();
		cu.setPassword(request.getParameter("password"));
		cu.setUsername(request.getParameter("username"));
		cu.setUserType(request.getParameter("userType"));
		cu.setId(ParamsFilter.converterToInt(request.getParameter("id")));
		return userService.update(cu);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("delete")
	public @ResponseBody Map delete(HttpServletRequest request){
		String ids = request.getParameter("ids");
		return userService.delete(ids);
	}
}
