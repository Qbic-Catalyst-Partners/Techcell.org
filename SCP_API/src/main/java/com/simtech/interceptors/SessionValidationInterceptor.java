package com.simtech.interceptors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.simtech.exception.BusinessException;
import com.simtech.service.UserService;
import com.simtech.util.AuthTokenUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;

@Component
public class SessionValidationInterceptor implements HandlerInterceptor {
	private static final Logger logger = LoggerFactory.getLogger(SessionValidationInterceptor.class);

	@Value("${jwt.auth-required}")
	private String authRequired;
	public static final String FALSE_STR = "false";

	@Autowired
	private UserService userService;

	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		// Allow CORS pre-flight requests to pass through without authentication
		if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
			return true;
		}
		if (FALSE_STR.equalsIgnoreCase(authRequired)) {
			return true;
		} else {
			if (isExcluseAuth(request.getRequestURI())) {
				return true;
			} else {
				String authToken = null;
				try {
					authToken = request.getHeader("Authorization");

					if (authToken != null) {
						Claims claims = AuthTokenUtil.parseToken(authToken);

						if (claims != null) {
							validateSession(claims.get("userId"));
							request.setAttribute("userId", claims.get("userId"));
							request.setAttribute("orgId", claims.get("orgId"));
							request.setAttribute("role", claims.get("role"));

							return true;
						} else {
							logger.error("Error in SessionValidationInterceptor:: preHandle():: Auth token is invalid");
							return false;
						}
					} else {
						throw new BusinessException("HeaderMissing");
					}
				} catch (ExpiredJwtException e) {
					throw new BusinessException("TokenExpired");
				}
			}
		}
	}

	private void validateSession(Object object) {
		Long userId = Long.valueOf(object.toString());
		userService.validateSession(userId);

	}

	private boolean isExcluseAuth(String path) {
		if (path.contains("/api/public") || "/".equals(path) || "/error".equals(path) || "/csrf".equals(path)
				|| path.contains("/actuator") || "/favicon.ico".equals(path)) {
			return true;
		}
		return false;
	}
}
