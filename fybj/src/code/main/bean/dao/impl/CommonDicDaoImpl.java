package code.main.bean.dao.impl;

import org.springframework.stereotype.Repository;

import code.main.bean.dao.CommonDicDao;
import code.main.bean.entity.CommonDic;

@Repository("commonDicDao")
public class CommonDicDaoImpl extends CommonDaoImpl<CommonDic, Integer> implements CommonDicDao{

}
