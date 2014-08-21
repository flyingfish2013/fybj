package code.main.bean.dao.impl;

import org.springframework.stereotype.Repository;

import code.main.bean.dao.LogManagerDao;
import code.main.bean.entity.LogManager;

@Repository("logManagerDao")
public class LogManagerDaoImpl extends CommonDaoImpl<LogManager, Integer> implements LogManagerDao{

}
