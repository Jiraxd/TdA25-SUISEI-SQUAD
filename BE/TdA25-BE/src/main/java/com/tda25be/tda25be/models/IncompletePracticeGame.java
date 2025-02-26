package com.tda25be.tda25be.models;

import com.tda25be.tda25be.entities.User;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.ReadOnlyProperty;

@Getter
@Setter
@Accessors(chain = true)
public class IncompletePracticeGame {
    @ReadOnlyProperty
    Long creationTime = System.currentTimeMillis();
    String uuid;
    User user;
    String symbol;
    Long timeLimit;
}
