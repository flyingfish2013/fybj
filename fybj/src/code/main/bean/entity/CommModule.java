package code.main.bean.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="sys_module")
public class CommModule {

	private int id;
	
	private String scn;
	
	private String text;
	
	private boolean leaf;
	
	private int pid;
	

	public CommModule() {
		super();
	}

	public CommModule(int id, String scn, String text, boolean leaf, int pid) {
		super();
		this.id = id;
		this.scn = scn;
		this.text = text;
		this.leaf = leaf;
		this.pid = pid;
	}

	public CommModule(String scn, String text, boolean leaf, int pid) {
		super();
		this.scn = scn;
		this.text = text;
		this.leaf = leaf;
		this.pid = pid;
	}

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Column(length=50,unique=true)
	public String getScn() {
		return scn;
	}

	public void setScn(String scn) {
		this.scn = scn;
	}

	@Column(length=50,name="moduleName")
	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	@Column
	public boolean isLeaf() {
		return leaf;
	}

	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}

	@Column
	public int getPid() {
		return pid;
	}

	public void setPid(int pid) {
		this.pid = pid;
	}
}
