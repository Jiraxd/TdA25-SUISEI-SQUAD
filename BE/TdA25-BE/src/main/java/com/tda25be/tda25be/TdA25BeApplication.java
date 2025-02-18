package com.tda25be.tda25be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;


@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class TdA25BeApplication {

	public static void main(String[] args) {SpringApplication.run(TdA25BeApplication.class, args);}
}
