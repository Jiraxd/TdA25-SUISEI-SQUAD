package com.tda25be.tda25be.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFound extends RuntimeException {
        public ResourceNotFound(){
        super("Resource not found");
    }
}
