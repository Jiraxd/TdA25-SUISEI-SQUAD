package com.tda25be.tda25be.models;

import com.tda25be.tda25be.enums.GameState;
import com.tda25be.tda25be.error.SemanticErrorException;
import org.apache.coyote.BadRequestException;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Board {
    public List<List<String>> board;
    public boolean oTurn = false;
    private boolean nextWin = false;

    public Board(List<List<String>> board) throws BadRequestException {
        if (board == null) throw new BadRequestException("Board wasn't specified");
        if(board.size() != 15) throw new SemanticErrorException("Board isn't 15x15");
        this.board = board;
    }


    public GameState getState(){
        nextWin = false;
        GameState state;
        int xAmount = 0;
        int oAmount = 0;
        for (List<String> row : board) {
            for (String symbol: row) {
                if(Objects.equals(symbol, "X")) xAmount++;
                else if (Objects.equals(symbol, "O")) oAmount++;
                else if (!symbol.isEmpty()) throw new SemanticErrorException("Invalid symbol");
            }
        }

        if(xAmount < oAmount) throw new SemanticErrorException("Wrong starting player");
        if(xAmount > oAmount) oTurn = true;
        if(xAmount == oAmount) oTurn = false;

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
    private boolean checkNeighbours(int x, int y){
        for (int dx = -1; dx <= 1; dx++) {
            for (int dy = -1; dy <= 1; dy++) {
                if (dx == 0 && dy == 0) continue;
                int nextX = x+dx;
                int nextY = y+dy;
                if(nextY < 0 || nextX < 0 || nextY > 14 || nextX >14) continue;
                if(step(x,y, nextX, nextY, 1, false) == 5) {
                    if ((board.get(y).get(x).equals("O") && oTurn) || (board.get(y).get(x).equals("X") && !oTurn) || nextWin) return true;
                    else nextWin = true;
                }
            }
    }
        return false;
    }
    private int step(int x, int y, int nextX, int nextY,int streak, Boolean placed){
        if(streak == 5) {
            return streak;
        };
        if(nextY >= 15 || nextX >= 15){
            return streak;
        }
        String cell1 = board.get(y).get(x);
        String cell2 = board.get(nextY).get(nextX);
        if(streak == 1 && Objects.equals(cell1, "") && !Objects.equals(cell2, "")){
            cell1 = cell2;
            placed = true;
        }
        if (!placed && !cell1.equals(cell2)) {
        if (cell1.isEmpty()) {
            cell1 = cell2;
            placed = true;
        } else if(cell2.isEmpty()) {
            cell2 = cell1;
        }
        }

        if(cell1.equals(cell2) && !cell1.isEmpty()) {
            int xStep = nextX - x;
            int yStep = nextY -y;
            if(nextY + yStep < 0 || nextX + xStep < 0) return streak;
            streak = step(nextX, nextY, nextX+xStep, nextY+yStep, streak+1, placed);
        }
        return streak;
    }

}
