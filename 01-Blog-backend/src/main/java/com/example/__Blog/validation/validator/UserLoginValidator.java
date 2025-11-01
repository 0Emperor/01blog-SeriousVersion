package com.example.__Blog.validation.validator;

import com.example.__Blog.dto.UserLogindto;
import com.example.__Blog.validation.annotation.ValidUserLogin;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class UserLoginValidator implements ConstraintValidator<ValidUserLogin, UserLogindto> {

    @Override
    public boolean isValid(UserLogindto user, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();

        boolean Empty = (isEmpty(user.username()) || isEmpty(user.password()));

        if (Empty) {
            context.buildConstraintViolationWithTemplate("both username and password are required to log in")
                    .addConstraintViolation();
            return false;
        }
        String username = user.username();
        if (!isEmpty(username)) {
            if (username.length() < 3 || username.length() > 10) {
                context.buildConstraintViolationWithTemplate("Username must be between 3 and 10 characters")
                        .addPropertyNode("username").addConstraintViolation();
                return false;
            }
            if (!username.matches("[a-zA-Z0-9]+")) {
                context.buildConstraintViolationWithTemplate("Username can only contain letters and numbers")
                        .addPropertyNode("username").addConstraintViolation();
                return false;
            }
        }

        return true;
    }

    private boolean isEmpty(String s) {
        return s == null || s.trim().isEmpty();
    }

}
