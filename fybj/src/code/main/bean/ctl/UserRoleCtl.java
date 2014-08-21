package code.main.bean.ctl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import code.main.bean.entity.CommUserRole;
import code.main.bean.service.UserRoleService;

@Controller
@RequestMapping("/ur")
public class UserRoleCtl {

	@Resource(name="urService")
	private UserRoleService urService;
	
	@RequestMapping("findByUser")
	public @ResponseBody List<CommUserRole> findByUser(@RequestParam int userId){
		return urService.findByUser(userId);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("add")
	public @ResponseBody Map add(@RequestParam int userId, @RequestParam String rids){
		return urService.add(userId, rids);
	}
}
