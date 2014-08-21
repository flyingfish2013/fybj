package code.main.bean.ctl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import code.main.bean.util.RandCodeUtil;

/**
 *不需要添加命名空间的操作
 */
@Controller
public class MainCtl {
	
	//跳转到主页
	@RequestMapping("index")
	public String toIndex(HttpServletRequest request, HttpServletResponse response){
		return "index";
	}
	
	//获取验证码
	@RequestMapping("randCode")
	public void getCode(HttpServletRequest request,HttpServletResponse response){
		RandCodeUtil.verifyCode(request, response);
	}
	
	//验证填写的验证码是否正确
	@RequestMapping("codeVld")
	public @ResponseBody boolean codeVld(HttpServletRequest request){
		HttpSession session = request.getSession();
		String randCode = (String) session.getAttribute("randCode");
		String code = request.getParameter("code");
		if(randCode.equalsIgnoreCase(code)){
			return true;
		}else{
			return false;
		}
	}
}
