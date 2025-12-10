package com.example.__Blog.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class RateLimitFilter implements Filter {

    // Separate caches for read and write operations
    private final Map<String, Bucket> readCache = new ConcurrentHashMap<>();
    private final Map<String, Bucket> writeCache = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String ip = getClientIp(httpRequest);
        String method = httpRequest.getMethod();

        // Determine if this is a read or write operation
        boolean isReadOperation = "GET".equalsIgnoreCase(method);

        // Get the appropriate bucket
        Bucket bucket = isReadOperation
                ? readCache.computeIfAbsent(ip, this::createReadBucket)
                : writeCache.computeIfAbsent(ip, this::createWriteBucket);

        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            String message = isReadOperation
                    ? "Too many requests. Please slow down."
                    : "Too many write operations. Please wait 5 seconds before trying again.";

            Map<String, Object> toast = Map.of(
                    "message", message,
                    "title", "Rate limit exceeded",
                    "type", "error");
            httpResponse.setStatus(429);
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write(objectMapper.writeValueAsString(Map.of("toast", toast)));
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    /**
     * Create bucket for read operations (GET)
     * Allows 10 requests per second
     */
    private Bucket createReadBucket(String ip) {
        Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofSeconds(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    /**
     * Create bucket for write operations (POST, PUT, PATCH, DELETE)
     * Allows 5 requests per minute (more restrictive)
     */
    private Bucket createWriteBucket(String ip) {
        Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofSeconds(5)));
        return Bucket.builder().addLimit(limit).build();
    }
}
