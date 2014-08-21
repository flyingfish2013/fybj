package code.main.bean.service;

import java.util.Map;

import javax.servlet.http.HttpSession;

import code.main.bean.domain.Page;
import code.main.bean.entity.CommUser;

public interface UserService {

	@SuppressWarnings("unchecked")
	Map add(CommUser user);
	
	@SuppressWarnings("unchecked")
	Map update(CommUser user);

	Page findPage(String field,String keyword);
	
	@SuppressWarnings("unchecked")
	Map doLogin(String username, String password,String rand,HttpSession session);
	
	@SuppressWarnings("unchecked")
	Map delete(String id);
}