package com.tda25be.tda25be.models;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.tda25be.tda25be.Enums.Difficulty;
import com.tda25be.tda25be.Enums.GameState;
import com.tda25be.tda25be.deserializers.DifficultyDeserializer;

import java.util.List;

public class TTTGame {
    public String uuid;
    public String name;
    public String createdAt;
    public String updatedAt;
    public GameState gameState;
    @JsonDeserialize(using = DifficultyDeserializer.class)
    public Difficulty difficulty;
    public List<List<String>> board;

}
