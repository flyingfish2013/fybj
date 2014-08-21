package code.main.bean.dao.impl;

import org.springframework.stereotype.Repository;

import code.main.bean.dao.CommACLDao;
import code.main.bean.entity.CommACL;

@Repository("aclDao")
public class CommACLDaoImpl extends CommonDaoImpl<CommACL, Integer> implements CommACLDao{

}
