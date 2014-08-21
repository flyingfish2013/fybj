package code.main.bean.dao.impl;

import org.springframework.stereotype.Repository;

import code.main.bean.dao.HospitalDao;
import code.main.bean.entity.Hospital;

@Repository("hospitalDao")
public class HospitalDaoImpl extends CommonDaoImpl<Hospital, Integer> implements HospitalDao{

}
