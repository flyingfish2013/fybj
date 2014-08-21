package code.main.bean.dao.impl;

import org.springframework.stereotype.Repository;

import code.main.bean.dao.CommACLDataDao;
import code.main.bean.entity.CommACLData;

@Repository("acldDao")
public class CommACLDataDaoImpl extends CommonDaoImpl<CommACLData, Integer> implements CommACLDataDao{

}
