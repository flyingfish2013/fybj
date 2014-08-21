package code.main.bean.ctl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import code.main.bean.domain.Page;
import code.main.bean.entity.CommonDic;
import code.main.bean.service.CommonDicService;
import code.main.bean.util.ParamsFilter;

@Controller
@RequestMapping("/commonDic")
public class CommonDicCtl {

	@Resource(name="commonDicService")
	private CommonDicService commonDicService;
	
	@SuppressWarnings("unchecked")
	@RequestMapping("listDic")
	public @ResponseBody List listDic(@RequestParam String type){
		return commonDicService.findByType(type);
	}
	
	@RequestMapping("list")
	public @ResponseBody Page list(HttpServletRequest request){
		String type = request.getParameter("type");
		String name = request.getParameter("name");
		return commonDicService.findPage(type, name);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("listType")
	public @ResponseBody List listType(HttpServletRequest request){
		return commonDicService.findTypes();
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("add")
	public @ResponseBody Map add(HttpServletRequest request){
		CommonDic tmp = new CommonDic();
		tmp.setName(request.getParameter("name"));
		tmp.setType(request.getParameter("type"));
		return commonDicService.add(tmp);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("update")
	public @ResponseBody Map update(HttpServletRequest request){
		int id = ParamsFilter.converterToInt(request.getParameter("id"));
		CommonDic tmp = new CommonDic();
		tmp.setId(id);
		tmp.setName(request.getParameter("name"));
		tmp.setType(request.getParameter("type"));
		return commonDicService.update(tmp);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("delete")
	public @ResponseBody Map delete(HttpServletRequest request){
		String ids = request.getParameter("ids");
		return commonDicService.del(ids);
	}
}
