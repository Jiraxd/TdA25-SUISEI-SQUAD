package com.tda25be.tda25be.entities;

import com.tda25be.tda25be.enums.Difficulty;
import com.tda25be.tda25be.enums.GameState;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Entity
@Table(name = "Game")
@Getter
@Setter
public class Game {
    @Id
    @UuidGenerator
    private String uuid;
    private String name;
    private String createdAt;
    private String updatedAt;
    private GameState gameState;
    private Difficulty difficulty;
    @Column(length = 1024)
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

}
