package code.main.bean.annotations;

import java.text.SimpleDateFormat;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class IsDateValidator implements ConstraintValidator<IsDate, String>{

	private String format;
	
	public void initialize(IsDate isDate) {
		this.format = isDate.format();
	}

	public boolean isValid(String obj, ConstraintValidatorContext constraintValidatorContext) {
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(format);
			sdf.setLenient(false);
			sdf.parse(obj);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

}
