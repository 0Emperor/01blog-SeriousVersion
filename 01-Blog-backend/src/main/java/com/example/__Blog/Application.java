package com.example.__Blog;

import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}
