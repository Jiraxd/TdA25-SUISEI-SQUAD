package com.tda25be.tda25be.models;

import com.fasterxml.jackson.annotation.JsonValue;
import com.tda25be.tda25be.enums.GameState;
import com.tda25be.tda25be.error.SemanticErrorException;
import org.apache.coyote.BadRequestException;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class Board {
    @JsonValue
    public List<List<String>> board;
    private boolean oTurn = false;
    private boolean nextWin = false;
    public String winner = null;
    public Board(List<List<String>> board) throws BadRequestException, SemanticErrorException {
        this.setBoard(board);
    }

    public void setBoard(List<List<String>> board) throws BadRequestException, SemanticErrorException {
        if (board == null) throw new BadRequestException("Board wasn't specified");
        if(board.size() != 15) throw new SemanticErrorException("Board isn't 15x15");
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
            }
        }
        if(xAmount > oAmount) oTurn = true;
        if(xAmount == oAmount) oTurn = false;
        String winner = checkWinner();
        if(!Objects.equals(winner, "")){
            this.winner = winner;
            return GameState.completed;
        }
        for (int y = 0; y < board.size(); y++) {
            List<String> row = board.get(y);
            for (int x = 0; x < row.size(); x++) {
                if(checkNeighbours(x,y)) {
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
    public String checkWinner() {

        int size = 15;
        for (int row = 0; row < size; row++) {
            for (int col = 0; col < size; col++) {
                String player = board.get(row).get(col);
                if (!player.equals(".")) {
                    if (checkDirection(board, row, col, 1, 0, player) || // Horizontal
                            checkDirection(board, row, col, 0, 1, player) || // Vertical
                            checkDirection(board, row, col, 1, 1, player) || // Diagonal (")
                            checkDirection(board, row, col, 1, -1, player)) { // Diagonal (/)
                        return player;
                    }
                }
            }
        }
        return "";
    }

    private static boolean checkDirection(List<List<String>> board, int row, int col, int dRow, int dCol, String player) {
        int count = 0;
        for (int i = 0; i < 5; i++) {
            int newRow = row + i * dRow;
            int newCol = col + i * dCol;
            if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15 || !board.get(newRow).get(newCol).equals(player)) {
                return false;
            }
            count++;
        }
        return count == 5;
    }

    public void playMove(int x, int y, Boolean placeO) throws BadRequestException, SemanticErrorException {
        System.out.println(x + " " + y + " " + placeO);
        List<List<String>> newBoard = board.stream()
                .map(ArrayList::new)
                .collect(Collectors.toList());
            String symbol = placeO ? "O" : "X";
            if(newBoard.get(y).get(x).isEmpty()) throw new SemanticErrorException("The cell is already occupied");
            newBoard.get(y).set(x, symbol);
            setBoard(newBoard);
            System.out.println(newBoard.toString());
    }
    public boolean isOTurn(){
        int xAmount = 0;
        int oAmount = 0;
        for (List<String> row : board) {
            for (String symbol: row) {
                if(Objects.equals(symbol, "X")) xAmount++;
                else if (Objects.equals(symbol, "O")) oAmount++;
            }
        }
        if(xAmount > oAmount) return true;
        if(xAmount == oAmount) return false;
        return false;
    }
}
