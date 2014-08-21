package code.main.bean.domain;

import java.util.List;

public class Page {
	/**
	 * 总记录数
	 */
	private Integer totalCount = 0;
	/**
	 * 当前页
	 */
	private Integer pageNumber = 1;
	/**
	 * 每页显示记录数
	 */
	private Integer pageSize = 10;
	/**
	 * 总页数
	 */
	@SuppressWarnings("unused")
	private Integer totalPage;
	/**
	 * 数据
	 */
	@SuppressWarnings("unchecked")
	private List datas;
	
	public Integer getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(Integer totalCount) {
		this.totalCount = totalCount;
	}


	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	public Integer getTotalPage() {
		return totalCount % pageSize == 0 ? totalCount / pageSize :totalCount / pageSize + 1;
	}

	public void setTotalPage(Integer totalPage) {
		this.totalPage = totalPage;
	}

	@SuppressWarnings("unchecked")
	public List getDatas() {
		return datas;
	}

	@SuppressWarnings("unchecked")
	public void setDatas(List datas) {
		this.datas = datas;
	}

	public Integer getPageNumber() {
		return pageNumber;
	}

	public void setPageNumber(Integer pageNumber) {
		this.pageNumber = pageNumber;
	}
}
