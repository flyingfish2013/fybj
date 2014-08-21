package code.main.bean.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="sys_acl_data")
public class CommACLData {
	
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
     * 区域数据控制
     */
    private int regionData;

    public CommACLData() {
		super();
	}

	public CommACLData(String principalType, int principalId, int regionData) {
		super();
		this.principalType = principalType;
		this.principalId = principalId;
		this.regionData = regionData;
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

	@Column(length=30)
	public int getRegionData() {
		return regionData;
	}

	public void setRegionData(int regionData) {
		this.regionData = regionData;
	}
}
