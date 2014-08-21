package code.main.bean.ctl;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import code.main.bean.util.FileOperation;
import code.main.bean.util.ParamsFilter;
import code.main.bean.util.PropertiesUtil;

@Controller
@RequestMapping("/fileUpload")
public class FileUploadCtl{
	
	@SuppressWarnings("unchecked")
	@RequestMapping("doUpload")
	public void doUpload(MultipartHttpServletRequest request,HttpServletResponse response){
		String fileName = "",prePath = "";
		boolean success = false;
		MultipartFile file = request.getFile("myUpload");
		int pathType = ParamsFilter.converterToInt(request.getParameter("pathType"));
		if (file != null) {
			try {
				String uploaddir = "";
				switch (pathType) {
					case 1:
						uploaddir = PropertiesUtil.getProp("school.upload.path");
						prePath = "school";
						break;
					case 2:
						uploaddir = PropertiesUtil.getProp("cookbook.upload.path");
						prePath = "cookbook";
						break;
				}
				String rootPath = uploaddir;
				DateFormat format = new SimpleDateFormat("yyyyMMddHHmmssSSS");
				String fName = format.format(new Date());
				String filename = file.getOriginalFilename();
				String fileType = filename.substring(filename.indexOf("."), filename.length());
				String ftpUrl = PropertiesUtil.getProp("ftp.url");
				int port = Integer.parseInt(PropertiesUtil.getProp("ftp.port"));
				String loginName = PropertiesUtil.getProp("ftp.loginName");
				String passWord = PropertiesUtil.getProp("ftp.passWord");
				fileName = FileOperation.uploadFileByFTP(ftpUrl, port, loginName, passWord, rootPath, fName+fileType, file);
				if(fileName.equals("failure")){
					success = false;
				}else{
					success = true;
				}
			} catch (Exception e) {
				e.printStackTrace();
				success = false;
			}
		}
		Map obj = new HashMap();
		obj.put("success", success);		
		obj.put("path", prePath+"/"+fileName);
		ObjectMapper om = new ObjectMapper();
		try {
			om.writeValue(response.getWriter(), obj);
		} catch (JsonGenerationException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping("deleteFiles")
	public @ResponseBody String deleteFiles(HttpServletRequest request) {
		boolean result = false;
		String[] fileArr = request.getParameter("files").split(",");
		int pathType = ParamsFilter.converterToInt(request.getParameter("pathType"));
		String rootPath = "";
		String ftpUrl = PropertiesUtil.getProp("ftp.url");
		int port = Integer.parseInt(PropertiesUtil.getProp("ftp.port"));
		String loginName = PropertiesUtil.getProp("ftp.loginName");
		String passWord = PropertiesUtil.getProp("ftp.passWord");
		switch (pathType) {
			case 1:
				rootPath = PropertiesUtil.getProp("school.upload.path");
				break;
			case 2:
				rootPath = PropertiesUtil.getProp("cookbook.upload.path");
				break;
		}
		for (int i = 0; i < fileArr.length; i++) {
			String name = fileArr[i].substring(fileArr[i].lastIndexOf("/")+1);
			result = FileOperation.deleteFileByFTP(ftpUrl, port, loginName, passWord, rootPath, name);
		}
		if(result){
			return "success";
		}else{
			return "failure";
		}
	}
}
