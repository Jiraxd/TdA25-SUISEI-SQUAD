package com.tda25be.tda25be.entities;

import com.tda25be.tda25be.enums.Difficulty;
import com.tda25be.tda25be.enums.GameState;
import com.tda25be.tda25be.models.Game;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import org.modelmapper.ModelMapper;

import java.util.List;

@Entity
@Table(name = "games")
@Getter
@Setter
public class GameEntity {
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

    public List<List<String>> getBoard() {
            return(Game.boardTo2DList(this.board));
            }
    public void setBoard(List<List<String>> board){
        this.board = board.toString();
    }

    public static GameEntity fromGame(Game game){
        ModelMapper modelMapper = new ModelMapper();
        return modelMapper.map(game, GameEntity.class);
    }
}
