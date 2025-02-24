package com.tda25be.tda25be.security;

import com.tda25be.tda25be.entities.Session;
import com.tda25be.tda25be.repositories.SessionRepo;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;
import java.util.Optional;

@Component
public class WebSocketAuthInterceptor implements HandshakeInterceptor{

    private final SessionRepo sessionRepository;

    public WebSocketAuthInterceptor(SessionRepo sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes){
        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpServletRequest = servletRequest.getServletRequest();
            String sessionToken = null;
            Cookie[] cookies = httpServletRequest.getCookies();
            if(cookies == null) {
                sessionToken = httpServletRequest.getHeader("Authorization");
            }else {
                for (Cookie cookie : cookies) {
                    if (cookie.getName().equals("logintoken")) {
                        sessionToken = cookie.getValue();
                    }
                }
            }
            if (sessionToken != null) {
                Optional<Session> session = sessionRepository.findByToken(sessionToken);
                if (session.isPresent()) {
                    attributes.put("user", session.get().getUser().getUuid());
                    attributes.put("token", session.get().getToken());
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {}
}

