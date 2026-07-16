package com.simtech.interceptors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Component
public class InterceptorConfigAdaptor implements WebMvcConfigurer {

	@Autowired
	SessionValidationInterceptor sessionValidationInterceptor;

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(sessionValidationInterceptor)
				.excludePathPatterns("/swagger-resources/**", "/swagger-ui.html", "/webjars/**", "/v2/api-docs");

	}

}
