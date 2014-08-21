package code.main.bean.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Target(value={ElementType.METHOD,ElementType.FIELD,ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy=IsDateValidator.class)
@Documented
public @interface IsDate {
	String message() default "日期格式不正确";
	Class<?>[] groups() default {};
	Class<? extends Payload>[] payload() default {};
	String format();
}
