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
@Table(name="t_hospital")
public class Hospital {
//	单位名称、负责人、联系电话、电子邮件、所在地区、单位性质(行政、业务)、
//	单位级别（一、二、三，可以不选）等。

	private int id;
	
	private String name;
	
	private String supe;
	
	private String tel;
	
	private String email;
	
	private RegionDic region;
	
	private CommonDic nature;
	
	private CommonDic level;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Column(length=100,name="hname")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(length=20,name="hspue")
	public String getSupe() {
		return supe;
	}

	public void setSupe(String supe) {
		this.supe = supe;
	}

	@Column(length=30,name="htel")
	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}

	@Column(length=100,name="hemail")
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@ManyToOne
	@JoinColumn(name="regionId")
	public RegionDic getRegion() {
		return region;
	}

	public void setRegion(RegionDic region) {
		this.region = region;
	}

	@ManyToOne
	@JoinColumn(name="hnature")
	public CommonDic getNature() {
		return nature;
	}

	public void setNature(CommonDic nature) {
		this.nature = nature;
	}

	@ManyToOne
	@JoinColumn(name="hlevel")
	public CommonDic getLevel() {
		return level;
	}

	public void setLevel(CommonDic level) {
		this.level = level;
	}
}
