package code.main.bean.ctl;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import code.main.bean.domain.Page;
import code.main.bean.entity.CommonDic;
import code.main.bean.entity.Hospital;
import code.main.bean.entity.InfoDoctor;
import code.main.bean.service.CommonDicService;
import code.main.bean.service.DoctorService;
import code.main.bean.service.HospitalService;
import code.main.bean.util.ParamsFilter;

@Controller
@RequestMapping("/doctor")
public class DoctorCtl {
	
	@Resource(name="doctorService")
	private DoctorService doctorService;
	
	@Resource(name="commonDicService")
	private CommonDicService commonDicService;
	
	@Resource(name="hospitalService")
	private HospitalService hospitalService;
	
	@RequestMapping("list")
	public @ResponseBody Page list(HttpServletRequest request){
		String field = request.getParameter("field");
		String keyword = request.getParameter("keyword");
		return doctorService.findPage(field, keyword);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("update")
	public @ResponseBody Map update(HttpServletRequest request){
		int hid = ParamsFilter.converterToInt(request.getParameter("hid"));
		int sid = ParamsFilter.converterToInt(request.getParameter("sid"));
		int id = ParamsFilter.converterToInt(request.getParameter("id"));
		CommonDic station = commonDicService.find(sid, true);
		Hospital hospital = hospitalService.find(hid, true);
		InfoDoctor tmp = new InfoDoctor();
		tmp.setId(id);
		tmp.setCardId(request.getParameter("cardId"));
		tmp.setBirthday(request.getParameter("birthday"));
		tmp.setName(request.getParameter("name"));
		tmp.setSex(request.getParameter("sex"));
		tmp.setTel(request.getParameter("tel"));
		tmp.setHospital(hospital);
		tmp.setStation(station);
		return doctorService.update(tmp);
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("delete")
	public @ResponseBody Map delete(HttpServletRequest request){
		String ids = request.getParameter("ids");
		return doctorService.delete(ids);
	}
}
