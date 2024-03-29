package code.main.bean.domain;

public class PagerContext {
	private static ThreadLocal<Integer> pageNumber = new ThreadLocal<Integer>();
	private static ThreadLocal<Integer> pageSize = new ThreadLocal<Integer>();
	private static ThreadLocal<Integer> start = new ThreadLocal<Integer>();
	private static ThreadLocal<Integer> limit = new ThreadLocal<Integer>();
	
	public static int getPageNumber() {
		Integer pn = pageNumber.get();
		if(pn == null){
			return 0;
		}else{
			return pn;
		}
	}
	public static void setPageNumber(int _pageNumber) {
		pageNumber.set(_pageNumber);
	}
	
	public static void removePageNumber(){
		pageNumber.remove();
	}
	
	public static int getPageSize() {
		Integer ps = pageSize.get();
		if(ps == null){
			return Integer.MAX_VALUE;
		} else {
			return ps;
		}
	}
	public static void setPageSize(int _pageSize) {
		pageSize.set(_pageSize);
	}
	
	public static void removePageSize(){
		pageSize.remove();
	}
	
	public static int getStart(){
		Integer _start = start.get();
		if(_start == null){
			return 0;
		}else{
			return _start;
		}
	}
	
	public static void setStart(int _start){
		start.set(_start);
	}
	
	public static void removeStart(){
		start.remove();
	}
	
	public static int getLimit(){
		Integer _limit = limit.get();
		if(_limit == null){
			return Integer.MAX_VALUE;
		}else{
			return _limit;
		}
	}
	
	public static void setLimit(int _limit){
		limit.set(_limit);
	}
	
	public static void removeLimit(){
		limit.remove();
	}
}
