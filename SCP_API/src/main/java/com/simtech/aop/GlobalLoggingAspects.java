package com.simtech.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class GlobalLoggingAspects {
	final static Logger logger = LoggerFactory.getLogger("");

	@Around("execution(* com.iyw.controller.*.*(..))")
	public Object controllerLoggingAspect(ProceedingJoinPoint joinPoint) throws Throwable {
		Object result = new Object();
		String source = joinPoint.getSignature().getDeclaringTypeName();
		String functionName = joinPoint.getSignature().getName() + "()";
		logger.info("Invoking started :: " + source + " :: " + functionName);
		result = joinPoint.proceed();
		logger.info("Execution completed :: " + result.toString() + "   , Args[] :: " + joinPoint.getArgs());
		return result;
	}

	/**
	 * Invoking Service package level logging using of the following query
	 * 
	 * @throws Throwable
	 **/

	@Around("execution(* com.iyw.service.*.*(..))")
	public Object serviceLogging(ProceedingJoinPoint joinPoint) throws Throwable {
		Object result = new Object();
		String source = joinPoint.getSignature().getDeclaringTypeName();
		String functionName = joinPoint.getSignature().getName() + "()";
		logger.info("Invoking started :: " + source + " :: " + functionName + "   , Args[] :: " + joinPoint.getArgs());
		Object tempResult = joinPoint.proceed();
		if (tempResult != null) {
			result = tempResult;
		}
		logger.info("Execution completed :: " + result == null ? ""
				: result.toString() + ", Args[] :: " + joinPoint.getArgs());
		return result;
	}

}
