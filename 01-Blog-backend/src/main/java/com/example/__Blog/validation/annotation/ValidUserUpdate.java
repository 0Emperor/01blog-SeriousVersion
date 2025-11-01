package com.example.__Blog.validation.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

import com.example.__Blog.validation.validator.UserUpdateValidator;

@Documented
@Constraint(validatedBy = UserUpdateValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidUserUpdate {
    String message() default "User update validation failed";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
