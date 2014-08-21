package code.main.bean.entity;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="sys_user")
public class CommUser {

	private int id;
	
	private String username;
	
	private String password;
	
	/**
	 * 1、管理员
	 * 2、医生
	 * 3、教委
	 * 4、托儿所
	 */
	private String userType;
	
	private String createTime;
	
	private List<InfoDoctor> dinfo;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Column(name="username",length=30)
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Column(name="password",length=30)
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Column(name="usertype",length=30)
	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	@Column(name="createTime",length=30)
	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	@OneToMany
	@JoinColumn(name="userId")
	public List<InfoDoctor> getDinfo() {
		return dinfo;
	}

	public void setDinfo(List<InfoDoctor> dinfo) {
		this.dinfo = dinfo;
	}


	
}
