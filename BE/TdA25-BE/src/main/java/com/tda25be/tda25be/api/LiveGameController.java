package com.tda25be.tda25be.api;

import com.tda25be.tda25be.models.Move;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class LiveGameController{

    @MessageMapping
    public void makeMove(@Payload Move move, @Headers Map<String, Object> headers) {


    }

}
