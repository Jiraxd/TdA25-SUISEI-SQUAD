package com.tda25be.tda25be.api;

import com.tda25be.tda25be.Enums.Difficulty;
import com.tda25be.tda25be.Enums.GameState;
import com.tda25be.tda25be.exceptions.SemanticErrorException;
import com.tda25be.tda25be.models.OrganizationResponse;
import com.tda25be.tda25be.models.TTTGame;
import org.apache.coyote.BadRequestException;
import org.springframework.web.bind.annotation.*;
import org.yaml.snakeyaml.util.EnumUtils;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/v1")
public class Controller {

    @GetMapping(path = "/test")
    public OrganizationResponse api() {
        System.out.println("XD");
        return new OrganizationResponse("Student Cyber Games");
    }
    @PostMapping(path="/games")

    public TTTGame createGame(@RequestBody TTTGame game) throws BadRequestException {
        if(game.difficulty == null) throw new BadRequestException("Difficulty wasn't specified");
        if(game.board == null) throw new BadRequestException("Board wasn't specified");
        if(game.name == null) throw new BadRequestException("Name wasn't specified");
        game.createdAt = LocalDateTime.now().toString();
        game.updatedAt = game.createdAt;
        game.gameState = GameState.earlygame;

        for (int i = 0; i < game.board.size(); i++) {
            List<String> row = game.board.get(i);
            for (int j = 0; j < row.size(); j++) {
                String cell = row.get(j).toLowerCase();
                if (!cell.equals("") && !cell.equals("x") && !cell.equals("o")) {
                    throw new SemanticErrorException(cell);
                }
                row.set(j, cell);
            }
        }
        return game;
    }
}
