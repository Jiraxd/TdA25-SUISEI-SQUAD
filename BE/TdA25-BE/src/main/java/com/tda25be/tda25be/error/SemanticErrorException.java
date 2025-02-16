package com.tda25be.tda25be.error;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class SemanticErrorException extends Exception{
    public SemanticErrorException(String message){
        super(message);
    }
}
