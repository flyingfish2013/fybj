package code.main.bean.dao.impl;

import org.springframework.stereotype.Repository;

import code.main.bean.dao.CommArchiveDao;
import code.main.bean.dao.CommUserDao;
import code.main.bean.entity.CommArchive;
import code.main.bean.entity.CommUser;

@Repository("commArchiveDao")
public class CommArchiveDaoImpl extends CommonDaoImpl<CommArchive, Integer> implements CommArchiveDao{

}
