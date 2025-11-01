package com.example.__Blog.validation.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

import com.example.__Blog.dto.UserUpdateDto;
import com.example.__Blog.validation.annotation.ValidUserUpdate;

public class UserUpdateValidator implements ConstraintValidator<ValidUserUpdate, UserUpdateDto> {

    private static final long MAX_PROFILE_SIZE = 7 * 1024 * 1024; // 7MB

    @Override
    public boolean isValid(UserUpdateDto user, ConstraintValidatorContext context) {
        // Reset default violation
        context.disableDefaultConstraintViolation();

        boolean allEmpty = (isEmpty(user.username()) && isEmpty(user.name()) &&
                isEmpty(user.bio()) && user.profile() == null);

        if (allEmpty) {
            context.buildConstraintViolationWithTemplate("You must provide at least one field to update")
                    .addConstraintViolation();
            return false;
        }

        // --- Username ---
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

        // --- Name ---
        String name = user.name();
        if (!isEmpty(name)) {

            String[] parts = name.split(" ");
            if (parts.length > 2) {
                context.buildConstraintViolationWithTemplate("Name cannot contain more than 2 spaces")
                        .addPropertyNode("name").addConstraintViolation();
                return false;
            } else if (parts.length == 1) {
                if (name.length() < 3 || name.length() > 10) {
                    context.buildConstraintViolationWithTemplate("Name must be between 3 and 10 characters")
                            .addPropertyNode("name").addConstraintViolation();
                    return false;
                }
                if (!name.matches("[a-zA-Z]+")) {
                    context.buildConstraintViolationWithTemplate("Name can only contain letters")
                            .addPropertyNode("name").addConstraintViolation();
                    return false;
                }
            } else {
                for (String part : parts) {
                    if (part.length() < 2 || part.length() > 7) {
                        context.buildConstraintViolationWithTemplate(
                                "Each part of the name must be between 2 and 13 characters").addPropertyNode("name")
                                .addConstraintViolation();
                        return false;
                    }
                    if (!part.matches("[a-zA-Z]+")) {
                        context.buildConstraintViolationWithTemplate("Name can only contain letters")
                                .addPropertyNode("name").addConstraintViolation();
                        return false;
                    }
                }
            }

        }

        // --- Bio ---
        String bio = user.bio();
        if (!isEmpty(bio) && bio.length() > 67) {
            context.buildConstraintViolationWithTemplate("Bio cannot exceed 67 characters")
                    .addPropertyNode("bio").addConstraintViolation();
            return false;
        }

        // --- Profile ---
        MultipartFile profile = user.profile();
        if (profile != null && !profile.isEmpty()) {
            if (profile.getSize() > MAX_PROFILE_SIZE) {
                context.buildConstraintViolationWithTemplate("Profile image must be smaller than 7MB")
                        .addPropertyNode("profile").addConstraintViolation();
                return false;
            }
            String contentType = profile.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                context.buildConstraintViolationWithTemplate("Profile must be an image file")
                        .addPropertyNode("profile").addConstraintViolation();
                return false;
            }
        }

        return true;
    }

    private boolean isEmpty(String s) {
        return s == null || s.trim().isEmpty();
    }
}
