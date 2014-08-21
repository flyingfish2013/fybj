package code.main.bean.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="t_info_doctor")
public class InfoDoctor {
	private int id;
//	所在单位、姓名、性别、出生日期、
//	工作岗位（字典）、身份证号，联系电话
	private Hospital hospital;
	
	private String name;
	
	
	private String sex;
	
	private String birthday;
	
	private CommonDic station;
	
	private String cardId;
	
	private String tel;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@ManyToOne
	@JoinColumn(name="hospitalId")
	public Hospital getHospital() {
		return hospital;
	}

	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}

	@Column(length=20,name="dname")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(length=20,name="dsex")
	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	@Column(length=20,name="dbirthday")
	public String getBirthday() {
		return birthday;
	}

	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}

	@ManyToOne
	@JoinColumn(name="dstation")
	public CommonDic getStation() {
		return station;
	}

	public void setStation(CommonDic station) {
		this.station = station;
	}

	@Column(length=20,name="dcardId")
	public String getCardId() {
		return cardId;
	}

	public void setCardId(String cardId) {
		this.cardId = cardId;
	}

	@Column(length=20,name="dtel")
	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}
}
