package code.main.bean.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="t_common_dic")
public class CommonDic {
	
	private int id;
	
	private String name;
	
	private String type;
	
	public CommonDic() {
		super();
	}
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Column(length=20,name="dic_name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(length=20,name="dic_type")
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
}
