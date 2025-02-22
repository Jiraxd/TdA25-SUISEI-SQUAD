package com.tda25be.tda25be.models;

import com.tda25be.tda25be.deserializers.BoardConverter;
import com.tda25be.tda25be.enums.Difficulty;
import com.tda25be.tda25be.enums.GameState;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class GameRequest {
    private String name;
    private Difficulty difficulty;
    private List<List<String>> board;

}
