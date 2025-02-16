package com.tda25be.tda25be.deserializers;

import com.tda25be.tda25be.enums.Difficulty;
import com.tda25be.tda25be.models.Board;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.apache.coyote.BadRequestException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
@Converter(autoApply = true)
public class BoardConverter implements AttributeConverter<Board, String> {

    @Override
    public String convertToDatabaseColumn(Board board) {
        return board.board.toString();
    }

    @Override
    public Board convertToEntityAttribute(String board) {
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
        try {
            return new Board(boardList);
        } catch (BadRequestException e) {
            throw new RuntimeException(e);
        }
    }
}
