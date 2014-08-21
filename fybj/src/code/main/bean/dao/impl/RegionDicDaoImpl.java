package code.main.bean.dao.impl;

import org.springframework.stereotype.Repository;

import code.main.bean.dao.RegionDicDao;
import code.main.bean.entity.RegionDic;

@Repository("regionDicDao")
public class RegionDicDaoImpl extends CommonDaoImpl<RegionDic, Integer> implements RegionDicDao{

}
