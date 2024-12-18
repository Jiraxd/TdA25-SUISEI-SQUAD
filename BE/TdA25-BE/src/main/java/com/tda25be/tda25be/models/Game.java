package com.tda25be.tda25be.models;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.tda25be.tda25be.enums.Difficulty;
import com.tda25be.tda25be.enums.GameState;
import com.tda25be.tda25be.deserializers.DifficultyDeserializer;
import com.tda25be.tda25be.entities.GameEntity;
import lombok.*;
import org.modelmapper.ModelMapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Getter
@Setter
public class Game {
    private String uuid;
    private String name;
    private String createdAt;
    private String updatedAt;
    private GameState gameState;
    @JsonDeserialize(using = DifficultyDeserializer.class)
    private Difficulty difficulty;
    private String board;

    public static List<List<String>> boardTo2DList(String board) {
        List<List<String>> boardList = new ArrayList<>();
        board = board.substring(1, board.length()-1);
        Pattern rowPattern = Pattern.compile("\\[(.*?)\\]");
        Matcher rowMatcher = rowPattern.matcher(board);

        while (rowMatcher.find()) {
            String rowContent = rowMatcher.group(1).trim();
            ArrayList<String> row = Arrays.stream(rowContent.split(",", -1))
                    .map(String::trim)
                    .collect(Collectors.toCollection(ArrayList<String>::new));

            boardList.add(row);
        }
        return boardList;
    }



    public List<List<String>> getBoard() {

        return boardTo2DList(this.board);
    }
    public void setBoard(List<List<String>> board){
        this.board = board.toString();
    }
    public static Game fromEntity(GameEntity entity){
        ModelMapper modelMapper = new ModelMapper();

        return modelMapper.map(entity, Game.class);
    }
}
