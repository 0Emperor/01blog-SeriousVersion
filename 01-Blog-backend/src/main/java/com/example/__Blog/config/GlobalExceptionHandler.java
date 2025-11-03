package com.example.__Blog.config;

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

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /* ================= 4xx CLIENT ERRORS ================= */

    /* 400 - @Valid validation failures */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        FieldError fieldError = ex.getBindingResult().getFieldError();

        String message = (fieldError != null && fieldError.getDefaultMessage() != null)
                ? fieldError.getDefaultMessage()
                : "Invalid input";

        String field = (fieldError != null) ? fieldError.getField() : "unknown";

        return toastResponse(HttpStatus.BAD_REQUEST, message, "Validation Error", "warning", Map.of("field", field));
    }

    /* 400 - @RequestParam / @PathVariable type mismatch */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message = String.format("Invalid value '%s' for parameter '%s'", ex.getValue(), ex.getName());
        return toastResponse(HttpStatus.BAD_REQUEST, message, "Bad Request", "warning",
                Map.of("parameter", ex.getName(), "invalidValue", ex.getValue()));
    }

    /* 400 - Bean validation (method-level) */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException ex) {
        ConstraintViolation<?> violation = ex.getConstraintViolations().iterator().next();
        String message = violation.getMessage();
        String property = violation.getPropertyPath().toString();
        return toastResponse(HttpStatus.BAD_REQUEST, message, "Invalid parameter", "warning",
                Map.of("parameter", property));
    }

    /* 400 - SQL unique / check constraints */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleSql(DataIntegrityViolationException ex) {
        log.warn("Data integrity violation: {}", ex.getMostSpecificCause().getMessage());
        return toastResponse(HttpStatus.BAD_REQUEST, "Duplicate or invalid data", "Database error", "error",
                Map.of("dbMessage", ex.getMostSpecificCause().getMessage()));
    }

    /* 401 - authentication failures */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuth(AuthenticationException ex) {
        return toastResponse(HttpStatus.UNAUTHORIZED, "Authentication required", "Unauthorized", "error", null);
    }

    /* 403 - access denied */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccess(AccessDeniedException ex) {
        return toastResponse(HttpStatus.FORBIDDEN, ex.getMessage(), "Forbidden", "warning", null);
    }

    /* 404 - not found */
    @ExceptionHandler({ NotFoundException.class, ResourceNotFoundException.class, NoHandlerFoundException.class })
    public ResponseEntity<Map<String, Object>> handleNotFound(Exception ex) {
        return toastResponse(HttpStatus.NOT_FOUND, ex.getMessage(), "Not Found", "warning", null);
    }

    /* 405 - method not allowed */
    @ExceptionHandler(org.springframework.web.HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleMethodNotAllowed(
            org.springframework.web.HttpRequestMethodNotSupportedException ex) {
        String msg = String.format("Method '%s' is not supported for this endpoint", ex.getMethod());
        return toastResponse(HttpStatus.METHOD_NOT_ALLOWED, msg, "Method Not Allowed", "warning", null);
    }

    /* 413 - file too large */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxSize(MaxUploadSizeExceededException ex) {
        return toastResponse(HttpStatus.PAYLOAD_TOO_LARGE, "File size exceeds maximum allowed", "File Too Large", "error", null);
    }

    /* ================= 5xx SERVER ERRORS ================= */

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(Exception ex, WebRequest req) {
        log.error("Unhandled exception at {} : {}", req.getDescription(false), ex.getMessage(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", null);
    }

    /* ================= helper methods ================= */

    private ResponseEntity<Map<String, Object>> toastResponse(HttpStatus status, String message, String title, String type, Map<String, Object> details) {
        Map<String, Object> toast = Map.of(
                "message", message,
                "title", title,
                "type", type
        );
        Map<String, Object> body = Map.of(
                "toast", toast,
                "details", details != null ? details : Map.of()
        );
        return ResponseEntity.status(status).body(body);
    }

    private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String message, Object details) {
        return ResponseEntity.status(status).body(new ErrorResponse(
                LocalDateTime.now().toString(),
                status,
                message,
                details
        ));
    }

    /* ================= lightweight DTO ================= */
    public record ErrorResponse(String timestamp, HttpStatus status, String message, Object details) {}
}
