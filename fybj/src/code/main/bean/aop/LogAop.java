package code.main.bean.aop;

import code.main.bean.service.LogManagerService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Aspect
@Component
public class LogAop {
	private Logger log = LoggerFactory.getLogger(LogAop.class);
	
	@Resource(name="logManagerService")
	private LogManagerService logManagerService;
	
	@SuppressWarnings("unused")
	@Pointcut("execution(* code.main.bean.ctl.*Ctl.*(..)) " +
			"&& !execution(* code.main.bean.ctl.AclCtl.*(..)) " +
			"&& !execution(* code.main.bean.ctl.FileUploadCtl.*(..)) " +
			"&& !execution(* code.main.bean.ctl.LoginCtl.*(..)) " +
			"&& !execution(* code.main.bean.ctl.MainCtl.*(..)) " +
			"&& !execution(* code.main.bean.ctl.UserRoleCtl.*(..)) " +
			"&& !execution(* code.main.bean.ctl.AcldCtl.*(..))")
	private void pointCut(){}
	
	@Before("pointCut()")
	public void doBeforeAction(){}

	
	@Around("pointCut()")
	public Object doBasicProfiling(ProceedingJoinPoint pjp) throws Throwable {
		Object result = null;
		HttpServletRequest request = InterceptorContext.getRequest();
		@SuppressWarnings("unused")
		HttpServletResponse response = InterceptorContext.getResponse();
		if(request != null){
			log.info("->进入ctl了。"+request.getRequestURL());
			// 拦截权限
			result = pjp.proceed();
			// 拦截生成日志
			String clazzName = pjp.getTarget().getClass().getSimpleName();
			logManagerService.add(clazzName,request);
		}else{
			result = pjp.proceed();
		}
		return result;
	}
	
	@AfterThrowing(pointcut="pointCut()",throwing="e")
	public void doAfterThrowing(Exception e) {
		try {
            e.printStackTrace();
			log.error("-----------------发生异常-----------");
			log.error(e.getMessage());
		} catch (Exception e1) {
			e1.printStackTrace();
			log.error(e.getMessage());
		}
	}
}
