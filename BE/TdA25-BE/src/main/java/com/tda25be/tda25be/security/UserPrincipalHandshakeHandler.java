package com.tda25be.tda25be.security;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;
@Component
public class UserPrincipalHandshakeHandler extends DefaultHandshakeHandler {
    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler,
                                      Map<String, Object> attributes) {
        String userUuid = (String) attributes.get("user");
        if (userUuid != null) {
            return new UserPrincipal(userUuid);
        }
        return null;
    }
}
