package code.main.bean.dao.impl;

import org.springframework.stereotype.Repository;

import code.main.bean.dao.CommModuleDao;
import code.main.bean.entity.CommModule;

@Repository("moduleDao")
public class CommModuleDaoImpl extends CommonDaoImpl<CommModule, Integer> implements CommModuleDao{

}
