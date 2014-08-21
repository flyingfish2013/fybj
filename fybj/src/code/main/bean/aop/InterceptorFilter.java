package code.main.bean.aop;


import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;



public class InterceptorFilter implements Filter {

	public void destroy() {
		
	}
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest)request;
		HttpServletResponse httpResponse = (HttpServletResponse)response;
		InterceptorContext.setRequest(httpRequest);
		InterceptorContext.setResponse(httpResponse);
		try{
			chain.doFilter(request, response);
		}finally{
			InterceptorContext.removeRequest();
			InterceptorContext.removeResponse();
		}
	}


	public void init(FilterConfig filterConfig) throws ServletException {
		
	}

}
