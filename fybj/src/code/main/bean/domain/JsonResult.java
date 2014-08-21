package code.main.bean.domain;

public class JsonResult {
	private boolean success = true;
	
	private Object obj = false;

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public Object getObj() {
		return obj;
	}

	public void setObj(Object obj) {
		this.obj = obj;
	}

	public JsonResult(boolean success, Object obj) {
		super();
		this.success = success;
		this.obj = obj;
	}

	public JsonResult() {
		super();
	}

	public JsonResult(Object obj) {
		super();
		this.obj = obj;
	}
	
}
