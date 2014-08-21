package code.main.bean.dao.impl;

import org.springframework.stereotype.Repository;

import code.main.bean.dao.CommUserRoleDao;
import code.main.bean.entity.CommUserRole;

@Repository("urDao")
public class CommUserRoleDaoImpl extends CommonDaoImpl<CommUserRole, Integer> implements CommUserRoleDao{

}
