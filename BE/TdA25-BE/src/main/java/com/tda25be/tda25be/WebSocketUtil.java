package com.tda25be.tda25be;

import com.tda25be.tda25be.entities.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class WebSocketUtil {

    SimpMessagingTemplate messagingTemplate;

    public WebSocketUtil(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendMessageToUsers(List<User> users, String destination, String key, String message, HttpStatus httpstatus) {
        users.forEach(user -> {
            sendMessageToUser(user.getUuid(), destination, key, message, httpstatus);
        });
    }

    public void sendMessageToUser(String uuid, String destination, String key, String message, HttpStatus status) {
        Map<String, String> payload = new HashMap<>();
        payload.put("type", key);
        payload.put("message", message);
        ResponseEntity<Map<String, String>> responseEntity = new ResponseEntity<>(payload, status);
        messagingTemplate.convertAndSendToUser(uuid, destination, responseEntity);
    }
}
