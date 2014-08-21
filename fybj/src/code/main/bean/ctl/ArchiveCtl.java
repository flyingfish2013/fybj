package code.main.bean.ctl;

import code.main.bean.domain.Page;
import code.main.bean.entity.CommArchive;
import code.main.bean.service.ArchiveService;
import code.main.bean.util.ExportUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/archive")
public class ArchiveCtl {

    @Resource(name="archiveService")
	private ArchiveService archiveService;
	
	@RequestMapping("list")
	public @ResponseBody Page list(HttpServletRequest request){
		String field = request.getParameter("field");
		String keyword = request.getParameter("keyword"); 
		Page page = archiveService.findPage(field, keyword);
		return page;
	}
	
	@RequestMapping(value = "add", method = RequestMethod.POST)
	public @ResponseBody Map add(CommArchive archive, HttpServletRequest request){
		System.out.println(archive);
		return archiveService.add(archive);
	}
	
	@RequestMapping("update")
	public @ResponseBody Map update(CommArchive archive, HttpServletRequest request){
		return archiveService.update(archive);
	}
	
	@RequestMapping("delete")
	public @ResponseBody Map delete(String ids, HttpServletRequest request){
		return archiveService.delete(ids);
	}

    @RequestMapping("export")
    public void exportToFile(String ids, HttpServletResponse response) throws Exception {
        List<CommArchive> archives = archiveService.findList(ids);
        ExportUtils<CommArchive> exportUtils = new ExportUtils<CommArchive>();
        HSSFWorkbook wb = exportUtils.createWorkbookByBeanList(archives, new String[]{"id", "name", "certNo","address","sex","birthday"});
        response.reset();
        response.setContentType("application/msexcel;charset=UTF-8");
        try {
            response.addHeader("Content-Disposition", "attachment;filename=result.xls");
            OutputStream out = response.getOutputStream();
            wb.write(out);
            out.flush();
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
