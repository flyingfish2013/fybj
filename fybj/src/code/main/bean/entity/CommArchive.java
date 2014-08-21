package code.main.bean.entity;

import javax.persistence.*;

@Entity
@Table(name="t_archives")
public class CommArchive {

	private int id;
	private String name;

	private String birthday;
	private String sex;
	private String certType;
	private String certNo;
	private String nation;
    private String minzu;

    public String getMinzu() {
        return minzu;
    }

    public void setMinzu(String minzu) {
        this.minzu = minzu;
    }

    private String mobilePhone;
	private String education;
	private String homePhone;
	private String major;
	private String hukouType;
	private String hukouBelong;
	private String email;
	private String workUnit;
	private String workPhone;
	
	private String province;
	private String city;
	private String destrict;
	private String villege;
	private String road;
	private String address;
    private String postNo;

    @Override
    public String toString() {
        return "CommArchive{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", birthday=" + birthday +
                ", sex='" + sex + '\'' +
                ", certType='" + certType + '\'' +
                ", certNo='" + certNo + '\'' +
                ", nation='" + nation + '\'' +
                ", minzu='" + minzu + '\'' +
                ", mobilePhone='" + mobilePhone + '\'' +
                ", education='" + education + '\'' +
                ", homePhone='" + homePhone + '\'' +
                ", major='" + major + '\'' +
                ", hukouType='" + hukouType + '\'' +
                ", hukouBelong='" + hukouBelong + '\'' +
                ", email='" + email + '\'' +
                ", workUnit='" + workUnit + '\'' +
                ", workPhone='" + workPhone + '\'' +
                ", province='" + province + '\'' +
                ", city='" + city + '\'' +
                ", destrict='" + destrict + '\'' +
                ", villege='" + villege + '\'' +
                ", road='" + road + '\'' +
                ", address='" + address + '\'' +
                ", postNo='" + postNo + '\'' +
                '}';
    }

    public String getPostNo() {
        return postNo;
    }

    public void setPostNo(String postNo) {
        this.postNo = postNo;
    }

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
		this.sex = sex;
	}
	public String getCertType() {
		return certType;
	}
	public void setCertType(String certType) {
		this.certType = certType;
	}
	public String getCertNo() {
		return certNo;
	}
	public void setCertNo(String certNo) {
		this.certNo = certNo;
	}
	public String getNation() {
		return nation;
	}
	public void setNation(String nation) {
		this.nation = nation;
	}
	public String getMobilePhone() {
		return mobilePhone;
	}
	public void setMobilePhone(String mobilePhone) {
		this.mobilePhone = mobilePhone;
	}
	public String getEducation() {
		return education;
	}
	public void setEducation(String education) {
		this.education = education;
	}
	public String getHomePhone() {
		return homePhone;
	}
	public void setHomePhone(String homePhone) {
		this.homePhone = homePhone;
	}
	public String getMajor() {
		return major;
	}
	public void setMajor(String major) {
		this.major = major;
	}
	public String getHukouType() {
		return hukouType;
	}
	public void setHukouType(String hukouType) {
		this.hukouType = hukouType;
	}
	public String getHukouBelong() {
		return hukouBelong;
	}
	public void setHukouBelong(String hukouBelong) {
		this.hukouBelong = hukouBelong;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getWorkUnit() {
		return workUnit;
	}
	public void setWorkUnit(String workUnit) {
		this.workUnit = workUnit;
	}
	public String getWorkPhone() {
		return workPhone;
	}
	public void setWorkPhone(String workPhone) {
		this.workPhone = workPhone;
	}
	
	public String getProvince() {
		return province;
	}
	public void setProvince(String province) {
		this.province = province;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getVillege() {
		return villege;
	}
	
	public String getDestrict() {
		return destrict;
	}
	public void setDestrict(String destrict) {
		this.destrict = destrict;
	}
	public void setVillege(String villege) {
		this.villege = villege;
	}
	public String getRoad() {
		return road;
	}
	public void setRoad(String road) {
		this.road = road;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}

}
