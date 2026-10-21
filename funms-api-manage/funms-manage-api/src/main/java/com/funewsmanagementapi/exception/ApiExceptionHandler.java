package com.funewsmanagementapi.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(RecordNotFoundException.class)
    public ResponseEntity<Map<String, String>> notFound(RecordNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
    }
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, String>> badRequest(BadRequestException e) {
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> invalid(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().isEmpty() ? "Du lieu khong hop le"
                : e.getBindingResult().getFieldErrors().get(0).getField() + ": khong hop le";
        return ResponseEntity.badRequest().body(Map.of("message", message));
    }
}
