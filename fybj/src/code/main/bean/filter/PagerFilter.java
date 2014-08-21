package code.main.bean.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import code.main.bean.domain.PagerContext;

public class PagerFilter implements Filter {
	public static final String PAGE_SIZE = "ps" ;
	public void destroy() {
	}

	public void doFilter(ServletRequest req, ServletResponse res,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) req;
		PagerContext.setPageNumber(getPageNumber(request));
		PagerContext.setPageSize(getPageSize(request));
		PagerContext.setStart(getStart(request));
		PagerContext.setLimit(getLimit(request));
		try {
			chain.doFilter(req, res);
		} catch (Exception e) {
			PagerContext.removePageNumber();
			PagerContext.removePageSize();
			PagerContext.removeStart();
			PagerContext.removeLimit();
		}
	}

	private int getLimit(HttpServletRequest request) {
		String limitValue = request.getParameter("limit");
		if(limitValue != null && !"".equals(limitValue.trim())){
			int limit = 0;
			try {
				limit = Integer.parseInt(limitValue);
			} catch (Exception e) {
			}
			if(limit != 0){
				request.getSession().setAttribute("limit", limit);
			}
		}
		Integer limit = (Integer) request.getSession().getAttribute("limit");
		if(limit == null){
			request.getSession().setAttribute("limit", 10);
			return 10;
		}
		return limit;
	}

	public void init(FilterConfig arg0) throws ServletException {
	}

	private int getPageNumber(HttpServletRequest request){
		int pageNumber = 1;
		try {
			pageNumber = Integer.parseInt(request.getParameter("pageNumber"));
			request.getSession().setAttribute("pn", pageNumber);
		} catch (Exception e) {
		}
		return pageNumber;
	}
	
	private int getStart(HttpServletRequest request){
		int start = 0;
		try {
			start = Integer.parseInt(request.getParameter("start"));
			request.getSession().setAttribute("start", start);
		} catch (Exception e) {
		}
		return start;
	}
	
	private int getPageSize(HttpServletRequest request){
		String psValue = request.getParameter("pageSize");
		if(psValue != null && !"".equals(psValue.trim())){
			int ps = 0;
			try {
				ps = Integer.parseInt(psValue);
			} catch (Exception e) {
			}
			if(ps != 0){
				request.getSession().setAttribute(PAGE_SIZE, ps);
			}
		}
		Integer pageSize = (Integer) request.getSession().getAttribute(PAGE_SIZE);
		if(pageSize == null){
			request.getSession().setAttribute(PAGE_SIZE, 10);
			return 10;
		}
		return pageSize;
	}
}
