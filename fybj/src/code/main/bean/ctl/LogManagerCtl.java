package code.main.bean.ctl;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import code.main.bean.domain.Page;
import code.main.bean.service.LogManagerService;

@Controller
@RequestMapping("/log")
public class LogManagerCtl {

	@Resource(name="logManagerService")
	private LogManagerService logManagerService;
	
	@RequestMapping("list")
	public @ResponseBody Page list(HttpServletRequest request){
		String beginTime = request.getParameter("beginTime");
		String endTime = request.getParameter("endTime");
		String operate = request.getParameter("operate");
		String username = request.getParameter("username");
		return logManagerService.findPage(beginTime, endTime, operate, username);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("delete")
	public @ResponseBody Map delete(HttpServletRequest request){
		String ids = request.getParameter("ids");
		return logManagerService.delete(ids);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("batchDelete")
	public @ResponseBody Map batchDelete(HttpServletRequest request){
		String beginTime = request.getParameter("beginTime");
		String endTime = request.getParameter("endTime");
		String operate = request.getParameter("operate");
		return logManagerService.batchDelete(beginTime, endTime, operate);
	}
}
