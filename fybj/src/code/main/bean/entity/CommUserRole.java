package code.main.bean.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="sys_user_role")
public class CommUserRole {

	private int id;
	
	private CommUser user;
	
	private CommRole role;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@ManyToOne(targetEntity=CommUser.class)
	@JoinColumn(name="user_id")
	public CommUser getUser() {
		return user;
	}

	public void setUser(CommUser user) {
		this.user = user;
	}

	@ManyToOne(targetEntity=CommRole.class)
	@JoinColumn(name="role_id")
	public CommRole getRole() {
		return role;
	}

	public void setRole(CommRole role) {
		this.role = role;
	}
}
