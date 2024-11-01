package com.tda25be.tda25be.api;

import com.tda25be.tda25be.Enums.GameState;
import com.tda25be.tda25be.models.NetError;
import com.tda25be.tda25be.models.OrganizationResponse;
import com.tda25be.tda25be.models.TTTGame;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1")
public class Controller {

    @GetMapping(path = "/test")
    public OrganizationResponse api() {
        System.out.println("XD");
        return new OrganizationResponse("Student Cyber Games");
    }
    @PostMapping(path="/games")
    public TTTGame createGame(@RequestBody TTTGame game){
        game.createdAt = LocalDateTime.now().toString();
        game.updatedAt = game.createdAt;
        game.gameState = GameState.earlygame;
        for (List<String> row : game.board) {
            for (String cell: row) {
                if(cell != "" || cell != "x" || cell != "o"){
                    NetError err = new NetError();
                    err.code = 422;
                    err.message = String.format("Hrací pole nesmí obsahovat %s, pouze x nebo o", cell);
                    return err;
                }
            }

        }
        return game;
    }
}
