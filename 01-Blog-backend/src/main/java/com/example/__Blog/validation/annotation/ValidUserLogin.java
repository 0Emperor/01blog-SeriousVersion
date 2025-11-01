package com.example.__Blog.validation.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.example.__Blog.validation.validator.UserLoginValidator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Documented
@Constraint(validatedBy = UserLoginValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidUserLogin {
    String message() default "User update validation failed";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
