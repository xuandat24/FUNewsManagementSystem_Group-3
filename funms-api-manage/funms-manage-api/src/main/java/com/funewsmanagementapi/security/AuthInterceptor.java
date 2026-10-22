package com.funewsmanagementapi.security;

import com.funewsmanagementapi.exception.BadRequestException;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Arrays;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception{
        // Cho qua các request Options của trình duyêt (Cors Preflight)
        if("OPTIONS".equalsIgnoreCase(request.getMethod())){
            return true;
        }

        if(!(handler instanceof HandlerMethod handlerMethod)){
            return true;
        }

        // kiểm tra xem method hoặc controller có gắn @RequireRole không
        RequireRole requireRole = handlerMethod.getMethodAnnotation(RequireRole.class);
        if(requireRole == null){
            requireRole = handlerMethod.getBeanType().getAnnotation(RequireRole.class);
        }

        // nếu endpoint không yêu cầu phần quyền thì cho qua
        if(requireRole == null){
            return true;
        }
        // Lấy token từ Authorization Header
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"status\":401,\"message\":\"Bạn chưa đăng nhập hoặc thiếu Bearer Token!\"}");
            return false;
        }

        String token = authHeader.substring(7);
        if (!jwtTokenProvider.validateToken(token)) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"status\":401,\"message\":\"Token không hợp lệ hoặc đã hết hạn!\"}");
            return false;
        }

        Claims claims = jwtTokenProvider.getClaimsFromToken(token);
        Integer userRole = claims.get("role", Integer.class);
        Long userId = Long.parseLong(claims.getSubject());

        // Đính kèm thông tin user vào request attribute để các Controller có thể dùng lại
        request.setAttribute("currentUserId", userId);
        request.setAttribute("currentUserRole", userRole);

        // Kiểm tra quyền (Nếu @RequireRole rỗng thì chỉ cần đăng nhập là được qua)
        int[] allowedRoles = requireRole.value();
        if (allowedRoles.length > 0) {
            boolean hasPermission = Arrays.stream(allowedRoles).anyMatch(role -> role == userRole);
            if (!hasPermission) {
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"status\":403,\"message\":\"Từ chối truy cập: Bạn không có quyền thực hiện chức năng này!\"}");
                return false;
            }
        }

        return true;
    }
}
