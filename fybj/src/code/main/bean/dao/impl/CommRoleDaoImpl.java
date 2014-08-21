package code.main.bean.dao.impl;

import org.springframework.stereotype.Repository;

import code.main.bean.dao.CommRoleDao;
import code.main.bean.entity.CommRole;

@Repository("roleDao")
public class CommRoleDaoImpl extends CommonDaoImpl<CommRole, Integer> implements CommRoleDao{

}
