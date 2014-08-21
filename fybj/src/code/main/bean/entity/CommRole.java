package code.main.bean.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="sys_role")
public class CommRole {
	
	/**
	 * 主键
	 */
	private int id;
	/**
	 * 角色名称
	 */
	private String roleName;
	/**
	 * 备注
	 */
	private String remark;
	
	

	public CommRole() {
		super();
	}

	public CommRole(String roleName, String remark) {
		super();
		this.roleName = roleName;
		this.remark = remark;
	}

	public CommRole(int id, String roleName, String remark) {
		super();
		this.id = id;
		this.roleName = roleName;
		this.remark = remark;
	}

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Column(length=30,unique=true)
	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	@Column(length=300)
	public String getRemark() {
		return remark;
	}
}
