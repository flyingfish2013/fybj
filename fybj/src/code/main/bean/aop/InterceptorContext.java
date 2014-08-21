package code.main.bean.aop;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class InterceptorContext {
	private static ThreadLocal<HttpServletRequest> _request = new ThreadLocal<HttpServletRequest>();
	private static ThreadLocal<HttpServletResponse> _response = new ThreadLocal<HttpServletResponse>();

	public static void setRequest(HttpServletRequest request) {
		_request.set(request);
	}

	public static HttpServletRequest getRequest() {
		HttpServletRequest request = (HttpServletRequest) _request.get();
		return request;
	}

	public static void removeRequest() {
		_request.remove();
	}
	
	
	public static void setResponse(HttpServletResponse response) {
		_response.set(response);
	}

	public static HttpServletResponse getResponse() {
		HttpServletResponse response = (HttpServletResponse) _response.get();
		return response;
	}

	public static void removeResponse() {
		_response.remove();
	}
	
	public static HttpSession getSession(){
		if(getRequest()!=null){
			return getRequest().getSession();
		}else{
			return null;
		}
	}
	
}
