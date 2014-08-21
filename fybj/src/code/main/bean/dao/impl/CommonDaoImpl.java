package code.main.bean.dao.impl;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.sql.SQLException;
import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;

import code.main.bean.dao.CommonDao;
import code.main.bean.domain.Page;
import code.main.bean.domain.PagerContext;

public class CommonDaoImpl<T, ID extends Serializable> implements
		CommonDao<T, ID> {

	private Class<T> persistentClass;

	@Autowired
	private HibernateTemplate template;

	@SuppressWarnings("unchecked")
	public CommonDaoImpl() {
		this.persistentClass = (Class<T>) ((ParameterizedType) getClass()
				.getGenericSuperclass()).getActualTypeArguments()[0];
	}

	public void add(T entity) {
		getTemplate().save(entity);
		getTemplate().flush();
	}

	public void del(T entity) {
		getTemplate().delete(entity);
	}

	public void update(T entity) {
		getTemplate().merge(entity);
	}

	@SuppressWarnings("unchecked")
	public T get(Class c, Serializable id) {
		return (T) getTemplate().get(persistentClass, id);
	}

	@SuppressWarnings("unchecked")
	public T load(Class c, Serializable id) {
		return (T) getTemplate().load(persistentClass, id);
	}

	@SuppressWarnings("unchecked")
	public List<T> findList(String hql, Object... params) {
		return getTemplate().find(hql, params);
	}

	@SuppressWarnings("unchecked")
	public T findObject(final String hql, final Object... params) {
		return (T) getTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				Query query = createQuery(session, hql, params);
				return query.uniqueResult();
			}
		});
	}

	public Page findPage(String hql, Object... params) {
		Integer pageNumber = PagerContext.getPageNumber();
		Integer pageSize = PagerContext.getPageSize();
		return findPage(hql, pageNumber, pageSize, params);
	}

	@SuppressWarnings("unchecked")
	public Page findPage(final String hql, final Integer pageNumber,
			final Integer pageSize, final Object... params) {
		Page page = new Page();
		// 每页记录数
		Integer totalCount = totalCount(hql, params);
		page.setPageSize(pageSize);
		// 总记录数
		page.setTotalCount(totalCount);
		// 当前页

		page.setPageNumber(pageNumber);
		// 获取数据集合
		List list = getTemplate().executeFind(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				Query q = createQuery(session, hql, params).setFirstResult(
						(pageNumber - 1) * pageSize).setMaxResults(pageSize);
				return q.list();
			}
		});
		// 把集合放入到page对象中

		page.setDatas(list);
		page.setTotalPage(totalCount % pageSize == 0 ? totalCount / pageSize
				: totalCount / pageSize + 1);
		return page;
	}

	/**
	 * 计算总记录数
	 */
	@SuppressWarnings("unchecked")
	private Integer totalCount(String hql, final Object[] objects) {
		Long totalCount = 0L;
		String tempHql = hql.toLowerCase();
		int from = tempHql.indexOf("from");
		int index = tempHql.indexOf("order by");
		// order by存在
		if (index != -1) {
			hql = "select count(*) " + hql.substring(from, index);
		} else {
			// order by不存在

			hql = "select count(*) " + hql.substring(from);
		}
		final String queryString = hql;
		totalCount = (Long) getTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				Query q = createQuery(session, queryString, objects);
				return q.uniqueResult();
			}
		});
		return totalCount.intValue();
	}

	private Query createQuery(Session session, String hql, Object... objects) {
		Query query = session.createQuery(hql);
		if (objects != null) {
			for (int i = 0; i < objects.length; i++) {
				query.setParameter(i, objects[i]);
			}
		}
		return query;
	}

	public Class<T> getPersistentClass() {
		return persistentClass;
	}

	public HibernateTemplate getTemplate() {
		return template;
	}

	public void setTemplate(HibernateTemplate template) {
		this.template = template;
	}

	@SuppressWarnings({ "unchecked" })
	public Integer count(final String hql, final Object... params) {
		Long totalCount = 0L;
		totalCount = (Long) getTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				Query q = createQuery(session, hql, params);
				return q.uniqueResult();
			}
		});
		return totalCount.intValue();
	}

	public Serializable addReturn(T entity) {
		return getTemplate().save(entity);
	}

	@SuppressWarnings({ "unchecked" })
	public Page findExtPage(final String hql, final Integer start,
			final Integer limit, final Object... params) {
		Page page = new Page();
		Integer totalCount = totalCount(hql, params);
		page.setTotalCount(totalCount);
		List list = getTemplate().executeFind(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				Query q = createQuery(session, hql, params).setFirstResult(
						start).setMaxResults(limit);
				return q.list();
			}
		});
		page.setDatas(list);
		return page;
	}

	public Page findExtPage(String hql, Object... params) {
		int start = PagerContext.getStart();
		int limit = PagerContext.getLimit();
		return findExtPage(hql, start, limit, params);
	}

	@SuppressWarnings({ "unchecked" })
	public void doHql(final String hql, final Object... params) {
		getTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				Query q = createQuery(session, hql, params);
				q.executeUpdate();
				return null;
			}

		});
	}

	@SuppressWarnings("unchecked")
	public void doSql(final String sql, final Object... params) {
		getTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session)throws HibernateException, SQLException {
				SQLQuery sq = createSQLQuery(session, sql, params);
				sq.executeUpdate();
				return null;
			}
		});
	}

	private SQLQuery createSQLQuery(Session session, String sql, Object... objects) {
		SQLQuery query = session.createSQLQuery(sql);
		if (objects != null) {
			for (int i = 0; i < objects.length; i++) {
				query.setParameter(i, objects[i]);
			}
		}
		return query;
	}

	@SuppressWarnings("unchecked")
	public void doHql(final String hql) {
		getTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				Query q = createQuery(session, hql);
				q.executeUpdate();
				return null;
			}

		});
	}

	@SuppressWarnings("unchecked")
	public void doSql(final String sql) {
		getTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session)throws HibernateException, SQLException {
				SQLQuery sq = createSQLQuery(session, sql);
				sq.executeUpdate();
				return null;
			}
		});
	}
}
