package com.simtech.util;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.simtech.exception.BusinessException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class AuthTokenUtil {

	private static final String SECRET_KEY = "ZnoYDRa3EHRtCaWJESZjO2Vl8u2dlcJPFUWiVK1_qXCclJsEoADBk2xcHSACgKwG";
	private static final long EXPIRATION_TIME = 86400000; // 24 hours in milliseconds
	private static final long TEN_MINUTES = 600000;
	// Generate a new JWT token

	public static String generateToken(String subject, Map<String, Object> claims, boolean isRefreshToken) {
		Date now = new Date();
		Date expirationDate = new Date(
				now.getTime() + (isRefreshToken ? EXPIRATION_TIME + TEN_MINUTES : EXPIRATION_TIME));
		claims.put("expirationDate", expirationDate);
		return Jwts.builder().setSubject(subject).setClaims(claims).setIssuedAt(now).setExpiration(expirationDate)
				.signWith(SignatureAlgorithm.HS256, SECRET_KEY).compact();
	}

	// Validate and parse a JWT token
	public static Claims parseToken(String token) {
		return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
	}

	// Method to refresh an expired token
	public Map<String, String> refreshToken(String expiredToken) {
		// Decode the expired token and extract its claims
		Claims claims = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(expiredToken).getBody();

		// Check if the token is expired
		if (claims.getExpiration().before(new Date())) {
			throw new BusinessException("TokenExpired");
		}
		String newToken = generateToken("MySubject", claims, false);
		String newRefreshToken = generateToken("MySubject", claims, true);
		Map<String, String> map = new HashMap<String, String>();
		map.put("newToken", newToken);
		map.put("newRefreshToken", newRefreshToken);
		return map;
	}
}
