package code.main.bean.dao;

import java.io.Serializable;
import java.util.List;

import code.main.bean.domain.Page;

public interface CommonDao<T, ID extends Serializable> {
	
	public void add(T entity);
	
	public Serializable addReturn(T entity);
	
	public void del(T entity);
	
	public void update(T entity);
	
	@SuppressWarnings("unchecked")
	public T get(Class c, Serializable id);
	
	@SuppressWarnings("unchecked")
	public T load(Class c, Serializable id);
	
	public T findObject(final String hql, final Object... params);

	public List<T> findList(final String hql, final Object... params);
	
	public Page findPage(final String hql, final Integer pageNumber, final Integer pageSize, final Object... params);
	public Page findPage(String hql, Object... params);
	public Page findExtPage(final String hql,  final Integer start, final Integer limit, final Object... params);
	public Page findExtPage(final String hql, final Object... params);
	
	public Integer count(final String hql, final Object... params);
	public void doHql(final String hql, final Object... params);
	public void doHql(final String hql);
	public void doSql(final String hql);
	public void doSql(final String sql, final Object... params);
}
