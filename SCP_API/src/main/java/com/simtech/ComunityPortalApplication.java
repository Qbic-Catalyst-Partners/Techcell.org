package com.simtech;

import java.io.IOException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.simtech")
@EnableScheduling
//@EnableFeignClients
public class ComunityPortalApplication {
	public static void main(String[] args) throws IOException {
		SpringApplication.run(ComunityPortalApplication.class, args);
	}
}
