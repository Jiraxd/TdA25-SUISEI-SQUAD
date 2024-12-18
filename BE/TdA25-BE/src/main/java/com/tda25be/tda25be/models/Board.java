package com.tda25be.tda25be.models;

import com.tda25be.tda25be.enums.GameState;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Board {
    public List<List<String>> board;
    public Board(List<List<String>> board){
        this.board = board;
    }


    public GameState getState(){
        GameState state;


        int xAmount = 0;
        int oAmount = 0;
        for (List<String> row : board) {
            for (String symbol: row) {
                if(Objects.equals(symbol, "X")) xAmount++;
                else if (Objects.equals(symbol, "O")) oAmount++;
            }
        }
        for (int y = 0; y < board.size(); y++) {
            List<String> row = board.get(y);
            for (int x = 0; x < row.size(); x++) {
                if(checkNeighbours(x,y)) {
                    System.out.println("line found at X: " + x + " Y:" +y);
                    return GameState.endgame;
                }
            }
        }

        int symbolsPlaced = xAmount + oAmount;
        if(symbolsPlaced  <= 10) state = GameState.opening;
        else state = GameState.midgame;
        return state;
    }
    public boolean checkNeighbours(int x, int y){
        for (int dx = -1; dx <= 1; dx++) {
            for (int dy = -1; dy <= 1; dy++) {
                if (dx == 0 && dy == 0) continue;
                int nextX = x+dx;
                int nextY = y+dy;
                if(nextY < 0 || nextX < 0 || nextY > 14 || nextX >14) continue;
                if(x == nextX && y == nextY){
                    System.out.println("XD");
                }
                if(step(x,y, nextX, nextY, 1, false) == 5) return true;
            }
    }
        return false;
    }
    public int step(int x, int y, int nextX, int nextY,int streak, Boolean placed){
        if(x == 1 && y == 4 && nextX == 2 && nextY == 4){
            System.out.println("XD");
        }
        if(streak == 5) return streak;
        if(nextY<0 || nextX<0){
            System.out.println("XD");
        }
        String cell1 = board.get(y).get(x);
        String cell2 = board.get(nextY).get(nextX);
        if(streak == 1 && Objects.equals(cell1, "") && !Objects.equals(cell2, "")){
            cell1 = cell2;
            placed = true;
        }
        if (!placed && !cell1.equals(cell2)) {
        if (cell1.equals("")) {
            cell1 = cell2;
            placed = true;
        } else if(cell2.equals("")) {
            cell2 = cell1;
        }
        }

        if(cell1.equals(cell2) && !cell1.equals("")) {
            int xStep = nextX - x;
            int yStep = nextY -y;
            if(nextY + yStep < 0 || nextX + xStep < 0) return streak;
            streak = step(nextX, nextY, nextX+xStep, nextY+yStep, streak+1, placed);
        }
        return streak;
    }

}
