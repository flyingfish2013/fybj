package code.main.bean.ctl;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import code.main.bean.entity.CommACL;
import code.main.bean.service.AclService;

@Controller
@RequestMapping("/acl")
public class AclCtl {

	@Resource(name="aclService")
	private AclService aclService;
	
	@RequestMapping("findByRole")
	public @ResponseBody List<CommACL> findByRole(@RequestParam int roleId){
		return aclService.findByRole(roleId);
	}
	
	@RequestMapping("findByUser")
	public @ResponseBody List<CommACL> findByUser(@RequestParam int userId){
		return aclService.findByUser(userId);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("add")
	public @ResponseBody Map addAcl(@RequestParam String principalType, @RequestParam int principalId, @RequestParam String mids){
		return aclService.AddAcl(principalType, principalId, mids);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("findAcls")
	public @ResponseBody Collection findAcls(@RequestParam int userId){
		return aclService.findAclByUser(userId);
	}
}
