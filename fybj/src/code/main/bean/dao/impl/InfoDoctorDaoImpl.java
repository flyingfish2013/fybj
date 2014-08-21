package code.main.bean.dao.impl;

import org.springframework.stereotype.Repository;

import code.main.bean.dao.InfoDoctorDao;
import code.main.bean.entity.InfoDoctor;

@Repository("infoDoctorDao")
public class InfoDoctorDaoImpl extends CommonDaoImpl<InfoDoctor, Integer> implements InfoDoctorDao{

}
