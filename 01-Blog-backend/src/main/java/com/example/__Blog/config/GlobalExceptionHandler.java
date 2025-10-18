package com.example.__Blog.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;

import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /* ================= 4xx CLIENT ERRORS ================= */

    /* 400 - validation failures (@Valid) */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(FieldError::getField,
                        fe -> fe.getDefaultMessage() == null ? "invalid" : fe.getDefaultMessage(),
                        (a, b) -> a)); // keep first
        return build(ResponseEntity.badRequest(), "Validation failed", errors);
    }

    /* 400 - @PathVariable / @RequestParam type mismatch */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String msg = String.format("Invalid value '%s' for parameter '%s'", ex.getValue(), ex.getName());
        return build(ResponseEntity.badRequest(), msg);
    }

    /* 400 - Bean Validation (method-level) */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, String> errors = ex.getConstraintViolations()
                .stream()
                .collect(Collectors.toMap(
                        cv -> cv.getPropertyPath().toString(),
                        ConstraintViolation::getMessage,
                        (a, b) -> a));
        return build(ResponseEntity.badRequest(), "Constraint violation", errors);
    }

    /* 400 - SQL unique / check constraints */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleSql(DataIntegrityViolationException ex) {
        log.warn("Data integrity violation: {}", ex.getMostSpecificCause().getMessage());
        return build(ResponseEntity.badRequest(), "Duplicate or invalid data");
    }

    /* 401 - wrong credentials / missing Authorization header */
    @ExceptionHandler({ AuthenticationException.class, AuthenticationException.class })
    public ResponseEntity<ErrorResponse> handleAuth(Exception ex) {
        return build(ResponseEntity.status(HttpStatus.UNAUTHORIZED), "Authentication required");
    }

    /* 403 - authorised but not allowed to do this */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccess(AccessDeniedException ex) {
        return build(ResponseEntity.status(HttpStatus.FORBIDDEN), ex.getMessage());
    }

    /* 404 - resource not found (custom or Spring) */
    @ExceptionHandler({ NotFoundException.class,ResourceNotFoundException.class, NoHandlerFoundException.class })
    public ResponseEntity<ErrorResponse> handleNotFound(Exception ex) {
        return build(ResponseEntity.status(HttpStatus.NOT_FOUND), ex.getMessage());
    }

    /* 405 - wrong HTTP method */
    @ExceptionHandler(org.springframework.web.HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMethodNotAllowed(
            org.springframework.web.HttpRequestMethodNotSupportedException ex) {
        return build(ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED),
                String.format("Method '%s' is not supported for this endpoint", ex.getMethod()));
    }

    /* 413 - file too large */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxSize(MaxUploadSizeExceededException ex) {
        return build(ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE),
                "File size exceeds maximum allowed");
    }

    /* ================= 5xx SERVER ERRORS ================= */

    /* catch-all: every other unchecked exception → 500 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(Exception ex, WebRequest req) {
        log.error("Unhandled exception at {} : {}", req.getDescription(false), ex.getMessage(), ex);
        return build(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR),
                "An unexpected error occurred");
    }

    /* ================= helper ================= */
    private ResponseEntity<ErrorResponse> build(ResponseEntity.BodyBuilder builder, String message) {
        return build(builder, message, null);
    }

    private ResponseEntity<ErrorResponse> build(ResponseEntity.BodyBuilder builder, String message, Object details) {
        return builder.body(new ErrorResponse(LocalDateTime.now().toString(),
                HttpStatus.valueOf(builder.build().getStatusCode().value()),
                message,
                details));
    }

    /* lightweight DTO */
    public record ErrorResponse(String timestamp,
            HttpStatus status,
            String message,
            Object details) {
    }
}