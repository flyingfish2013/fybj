package code.main.bean.ctl;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import code.main.bean.service.UserService;

@Controller
public class LoginCtl {
	
	@Autowired
	private UserService userService;
	
	/**
	 * 跳转到登录页面
	 **/
	@RequestMapping("login")
	public String toLogin(){
		return "/login";
	}
	
	@RequestMapping("/")
	public String toLogin2(){
		return "/login";
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("doLogin")
	public @ResponseBody Map doLogin(HttpServletRequest request){
		HttpSession session = request.getSession();
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		String rand = request.getParameter("rand");
		return userService.doLogin(username, password, rand,session);
	}
	
	@RequestMapping("doLogout")
	public @ResponseBody String doLogout(HttpServletRequest request){
		HttpSession session = request.getSession();
		if(session!=null){
			session.invalidate();
		}
		return "{\"flag\":true}";
	}
}
