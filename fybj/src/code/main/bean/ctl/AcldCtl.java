package code.main.bean.ctl;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import code.main.bean.entity.CommACLData;
import code.main.bean.service.AcldService;

@Controller
@RequestMapping("/acld")
public class AcldCtl {

	@Resource(name="acldService")
	private AcldService acldService;
	
	@RequestMapping("findByRole")
	public @ResponseBody List<CommACLData> findByRole(@RequestParam int roleId){
		return acldService.findByRole(roleId);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("findColumnByRole")
	public @ResponseBody List findColumnByRole(@RequestParam int roleId){
		return acldService.findColumnByRole(roleId);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("findColumnByUser")
	public @ResponseBody List findColumnByUser(@RequestParam int userId){
		return acldService.findColumnByUser(userId);
	}
	
	@RequestMapping("findByUser")
	public @ResponseBody List<CommACLData> findByUser(@RequestParam int userId){
		return acldService.findByUser(userId);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("add")
	public @ResponseBody Map addAcl(@RequestParam String principalType, @RequestParam int principalId, @RequestParam String mids){
		return acldService.addAcld(principalType, principalId, mids);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("findAclds")
	public @ResponseBody Collection findAclds(@RequestParam int userId){
		return acldService.findAcldByUser(userId);
	}
}
