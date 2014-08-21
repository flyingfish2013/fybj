package code.main.bean.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="sys_acl")
public class CommACL {
	
	/**
     * 主键
     */
    private int id;
    /**
     * 主体类型
     * role or user
     */
    private String principalType;
    
    /**
     * 主体标示user or role pk
     */
    private int principalId;
    
    /**
     * 模块标示 module id
     */
    private int sysModuleId;
    
    public CommACL() {
		super();
	}

	public CommACL(String principalType, int principalId, int sysModuleId) {
		super();
		this.principalType = principalType;
		this.principalId = principalId;
		this.sysModuleId = sysModuleId;
	}

	@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Column(length=10)
	public String getPrincipalType() {
		return principalType;
	}

	public void setPrincipalType(String principalType) {
		this.principalType = principalType;
	}

	@Column
	public int getPrincipalId() {
		return principalId;
	}

	public void setPrincipalId(int principalId) {
		this.principalId = principalId;
	}

	@Column
	public int getSysModuleId() {
		return sysModuleId;
	}

	public void setSysModuleId(int sysModuleId) {
		this.sysModuleId = sysModuleId;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + principalId;
		result = prime * result
				+ ((principalType == null) ? 0 : principalType.hashCode());
		result = prime * result + sysModuleId;
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		CommACL other = (CommACL) obj;
		if (principalId != other.principalId)
			return false;
		if (principalType == null) {
			if (other.principalType != null)
				return false;
		} else if (!principalType.equals(other.principalType))
			return false;
		if (sysModuleId != other.sysModuleId)
			return false;
		return true;
	}
}
