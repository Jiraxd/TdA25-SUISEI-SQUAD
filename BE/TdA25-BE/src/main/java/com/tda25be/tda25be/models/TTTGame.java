package com.tda25be.tda25be.models;

import com.tda25be.tda25be.Enums.Difficulty;
import com.tda25be.tda25be.Enums.GameState;

import java.util.List;

public class TTTGame {
    public String uuid;
    public String name;
    public String createdAt;
    public String updatedAt;
    public GameState gameState;
    public Difficulty difficulty;
    public List<List<String>> board;

}
