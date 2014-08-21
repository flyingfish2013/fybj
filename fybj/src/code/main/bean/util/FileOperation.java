package code.main.bean.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

public class FileOperation {
	private static Logger logger = LoggerFactory.getLogger(FileOperation.class);
	/**
	 * 删除文件
	 * @param filePathAndName String 文件路径及名称 如c:/fqf.txt
	 * @param fileContent String
	 * @return boolean
	 */
	public static boolean delFile(String filePathAndName) {
		File myDelFile = new java.io.File(filePathAndName);
		if (!myDelFile.exists()) {
			return true;
		}
		return myDelFile.delete();
	}
	
	/**
	 * 删除指定文件路径下面的所有文件和文件夹
	 * @param file
	 */
	public static boolean delFiles(File file) {
		boolean flag = false;
		try {
			if (file.exists()) {
				if (file.isDirectory()) {
					String[] contents = file.list();
					for (int i = 0; i < contents.length; i++) {
						File file2X = new File(file.getAbsolutePath() + "/" + contents[i]);
						if (file2X.exists()) {
							if (file2X.isFile()) {
								flag = file2X.delete();
							} else if (file2X.isDirectory()) {
								delFiles(file2X);
							}
						} else {
							throw new RuntimeException("File not exist!");
						}
					}
				}
				flag = file.delete();
			} else {
				throw new RuntimeException("File not exist!");
			}
		} catch (Exception e) {
			flag = false;
			e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * 判断文件名是否已经存在，如果存在则在后面加(n)的形式返回新的文件名，否则返回原始文件名 例如：已经存在文件名 log4j.htm
	 * 则返回log4j(1).htm
	 * @param fileName文件名
	 * @param dir判断的文件路径
	 * @return 判断后的文件名
	 */
	public static String checkFileName(String fileName, String dir) {
		boolean isDirectory = new File(dir + fileName).isDirectory();
		if (FileOperation.isFileExist(fileName, dir)) {
			int index = fileName.lastIndexOf(".");
			StringBuffer newFileName = new StringBuffer();
			String name = isDirectory ? fileName : fileName.substring(0, index);
			String extendName = isDirectory ? "" : fileName.substring(index);
			int nameNum = 1;
			while (true) {
//				newFileName.append(name).append("(").append(nameNum).append(")");
				newFileName.append(name).append(nameNum);
				if (!isDirectory) {
					newFileName.append(extendName);
				}
				if (FileOperation.isFileExist(newFileName.toString(), dir)) {
					nameNum++;
					newFileName = new StringBuffer();
					continue;
				}
				return newFileName.toString();
			}
		}
		return fileName;
	}
	
	public static String checkFileName2(String fileName, String dir) {
		String fName = fileName;
		while(FileOperation.isFileExist(fileName, dir)){
			DateFormat format = new SimpleDateFormat("yyyyMMddHHmmssSSS");
			fName = format.format(new Date());	
		}
		return fName;
	}
	
	/**
	 * 上传文件并返回上传后的文件名
	 * @param uploadFileName被上传的文件名称
	 * @param savePath文件的保存路径
	 * @param uploadFile被上传的文件
	 * @return 成功与否
	 * @throws IOException
	 */
	public static String uploadForName(String uploadFileName, String savePath, File uploadFile) throws IOException {
		String newFileName = checkFileName2(uploadFileName, savePath);
		FileOutputStream fos = null;
		FileInputStream fis = null;
		try {
			fos = new FileOutputStream(savePath + newFileName);
			fis = new FileInputStream(uploadFile);
			byte[] buffer = new byte[1024];
			int len = 0;
			while ((len = fis.read(buffer)) > 0) {
				fos.write(buffer, 0, len);
			}
		} catch (FileNotFoundException e) {
			throw e;
		} catch (IOException e) {
			throw e;
		} finally {
			try {
				if (fos != null) {
					fos.close();
				}
				if (fis != null) {
					fis.close();
				}
			} catch (IOException e) {
				throw e;
			}
		}
		return newFileName;
	}
	
	/**
	 * 上传文件并返回上传后的文件名
	 * @param uploadFileName被上传的文件名称
	 * @param savePath文件的保存路径
	 * @param uploadFile被上传的文件
	 * @return 成功与否
	 * @throws IOException
	 */
	public static String uploadForName(String uploadFileName, String savePath, MultipartFile uploadFile) throws IOException {
		String newFileName = checkFileName2(uploadFileName, savePath);
		FileOutputStream fos = null;
		InputStream fis = uploadFile.getInputStream();
		try {
			fos = new FileOutputStream(savePath + newFileName);
			byte[] buffer = new byte[1024];
			int len = 0;
			while ((len = fis.read(buffer)) > 0) {
				fos.write(buffer, 0, len);
			}
		} catch (FileNotFoundException e) {
			throw e;
		} catch (IOException e) {
			throw e;
		} finally {
			try {
				if (fos != null) {
					fos.close();
				}
				if (fis != null) {
					fis.close();
				}
			} catch (IOException e) {
				throw e;
			}
		}
		return newFileName;
	}
	
	/**
	 * 判断文件是否存在
	 * @param fileName
	 * @param dir
	 * @return
	 */
	public static boolean isFileExist(String fileName, String dir) {
		File files = new File(dir + fileName);
		return (files.exists()) ? true : false;
	}
	
	private static FTPClient ftpClient = new FTPClient();
	private static boolean isSuccess = false;
	
	/**
	  * 连接并登录到ftp服务器
	  * @param ftpUrl:远程ftp地址
	  * @param port:端口号,默认为21
	  * @param loginName:登录名称
	  * @param passWord:登录密码
	  * @param remotePath:远程目录
	  */
	@SuppressWarnings("static-access")
	public static boolean connectFTP(String ftpUrl,int port,String loginName,String passWord,String remotePath){
	  int replyCode = 0;
	  try {
		   ftpClient.setControlEncoding("UTF-8");//设置编码格式,防止文件名称中出现中文乱码
		   ftpClient.connect(ftpUrl, port);//连接ftp服务器
		   replyCode = ftpClient.getReplyCode();
		   if(FTPReply.isPositiveCompletion(replyCode)){
			    //验证登录
			    if(ftpClient.login(loginName, passWord)){
			    	isSuccess = true;
			    }
		   }else{
			   ftpClient.disconnect();
		   }
		   ftpClient.setFileType(ftpClient.BINARY_FILE_TYPE); // 设置上传文件以二进制上传
		   ftpClient.changeWorkingDirectory(remotePath); //切换到ftp服务器当前的工作目录
	  } catch (IOException e) {
		  e.printStackTrace();
		  return isSuccess;
	  }
	  return isSuccess;
	}
	
	/**
	 * 上传文件并返回上传后的文件名
	  * 将本地文件上传到远程ftp服务器
	  * @param ftpUrl:远程ftp地址
	  * @param port:端口号,默认为21
	  * @param loginName:登录名称
	  * @param passWord:登录密码
	  * @param remotePath:保存上传文件的远程工作目录
	  * @param uploadFile:本地要上传的文件
	  * @param uploadFileName:本地要上传的文件名
	  */
	public static String uploadFileByFTP(String ftpUrl,int port,String loginName,String passWord,String remotePath,String uploadFileName,File uploadFile){
	   //上传的文件名称,不能包含路径信息,否则无法上传成功
	  String remoteFileName = checkFileName2(uploadFileName, remotePath);
	  InputStream inputStream = null;
	  boolean success = connectFTP(ftpUrl, port, loginName, passWord, remotePath);
	  if(success){
		  try {
		    inputStream = new FileInputStream(uploadFile);
		    //开始上传
		    ftpClient.storeFile(remoteFileName,inputStream);
		    inputStream.close();
		    ftpClient.logout();
		   } catch (IOException e) {
		      e.printStackTrace();
		   }finally {
			   closeFTPConnect();
		   }
	  }else{
		  logger.info("ftp连接失败,请检查用户名和密码是否正确");
		  remoteFileName = "failure";
	  }
	  return remoteFileName;
	}
	
	/**
	 * spring3 mvc上传文件并返回上传后的文件名
	  * 将本地文件上传到远程ftp服务器
	  * @param ftpUrl:远程ftp地址
	  * @param port:端口号,默认为21
	  * @param loginName:登录名称
	  * @param passWord:登录密码
	  * @param remotePath:保存上传文件的远程工作目录
	  * @param uploadFile:本地要上传的文件
	  * @param uploadFileName:本地要上传的文件名
	  */
	public static String uploadFileByFTP(String ftpUrl,int port,String loginName,String passWord,String remotePath,String uploadFileName,MultipartFile uploadFile){
	   //上传的文件名称,不能包含路径信息,否则无法上传成功
	  String remoteFileName = checkFileName2(uploadFileName, remotePath);
	  InputStream inputStream = null;
	  boolean success = connectFTP(ftpUrl, port, loginName, passWord, remotePath);
	  if(success){
		  try {
			inputStream = uploadFile.getInputStream();
		    //开始上传
		    ftpClient.storeFile(remoteFileName,inputStream);
		    inputStream.close();
		    ftpClient.logout();
		   } catch (IOException e) {
		      e.printStackTrace();
		   }finally {
			   closeFTPConnect();
		   }
	  }else{
		  logger.info("ftp连接失败,请检查用户名和密码是否正确");
		  remoteFileName = "failure";
	  }
	  return remoteFileName;
	}
	

	/**
	  * 通过ftp删除文件
	  */
	public static boolean deleteFileByFTP(String ftpUrl,int port,String loginName,String passWord,String remotePath,String delFileName){
	  boolean flag = false;
	  boolean success = connectFTP(ftpUrl, port, loginName, passWord, remotePath);
	  if(success){
		  try {
			  flag = ftpClient.deleteFile(remotePath+delFileName);
		  } catch (Exception e) {
			  e.printStackTrace();
		  }finally {
			  closeFTPConnect();
		  }
	  }else{
		  logger.info("ftp连接失败,请检查用户名和密码是否正确");
		  flag = false;
	  }
	  return flag;
	}
	
	/**
	  * 关闭与ftp服务器的连接
	  */
	public static void closeFTPConnect(){
	  try {
		   if (ftpClient != null && ftpClient.isConnected()) {
			   ftpClient.disconnect();
		   }
	  } catch (IOException e) {
		  e.printStackTrace();
	  } finally {
		   try {
			    if(ftpClient != null && ftpClient.isConnected()){    
			    	ftpClient.disconnect();
			    }
		   } catch (IOException e) {
			   e.printStackTrace();
		   }
	  }
	}
}
