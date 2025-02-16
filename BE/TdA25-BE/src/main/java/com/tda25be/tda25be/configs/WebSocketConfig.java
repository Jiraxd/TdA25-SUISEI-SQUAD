package com.tda25be.tda25be.configs;

import com.tda25be.tda25be.security.UserPrincipalHandshakeHandler;
import com.tda25be.tda25be.security.WebSocketAuthInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final WebSocketAuthInterceptor webSocketAuthInterceptor;
    private final UserPrincipalHandshakeHandler userPrincipalHandshakeHandler;

    public WebSocketConfig(WebSocketAuthInterceptor webSocketAuthInterceptor, UserPrincipalHandshakeHandler userPrincipalHandshakeHandler) {
        this.webSocketAuthInterceptor = webSocketAuthInterceptor;
        this.userPrincipalHandshakeHandler = userPrincipalHandshakeHandler;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/user", "/topic");
        config.setApplicationDestinationPrefixes("/app/handshake");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/app/ws")
                .setAllowedOrigins("*")
                .addInterceptors(webSocketAuthInterceptor)
                .setHandshakeHandler(userPrincipalHandshakeHandler)
                .withSockJS();
    }
}