package com.tda25be.tda25be.exceptions;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class SemanticErrorException extends RuntimeException{
    public SemanticErrorException(String badChar){
        super(String.format("Semantic error: board can only contain x's and o's, yours contains %s", badChar));
    }
}
