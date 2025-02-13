package com.tda25be.tda25be.api;

import com.tda25be.tda25be.entities.Game;
import com.tda25be.tda25be.error.ResourceNotFound;
import com.tda25be.tda25be.models.Board;
import com.tda25be.tda25be.models.OrganizationResponse;
import com.tda25be.tda25be.repositories.GameRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/v1")
public class GameController {

    GameRepository gameRepository;
    public GameController(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }
    @GetMapping(path = "/test")
    public OrganizationResponse api() {
        return new OrganizationResponse("Student Cyber Games");
    }
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(path="/games")
    public Game createGame(@RequestBody Game game) throws BadRequestException {
        List<List<String>> board = game.getBoard();
        if (game.getDifficulty() == null) throw new BadRequestException("Difficulty wasn't specified");
        if (game.getName() == null) throw new BadRequestException("Name wasn't specified");
        game.setCreatedAt(LocalDateTime.now().toString());
        game.setUpdatedAt(game.getCreatedAt());
        game.setGameState(new Board(board).getState());
        return gameRepository.saveAndFlush(game);
    }
    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path="/games" )
    public List<Game> getAllGames(){
        return new ArrayList<>(gameRepository.findAll());
    }
    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path="/games/{uuid}")
    public Game getGame(@PathVariable String uuid){
        try {
            return gameRepository.findById(uuid).get();
        }
        catch (NoSuchElementException exception){
            throw new ResourceNotFound();
        }
    }
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping(path="/games/{uuid}")
    public void deleteGame(@PathVariable String uuid) {
        try {
            gameRepository.deleteById(uuid);
        } catch (NoSuchElementException exception) {
            throw new ResourceNotFound();
        }
    }
    @ResponseStatus(HttpStatus.OK)
    @PutMapping(path="/games/{uuid}")
    public Game updateGame(@PathVariable String uuid, @RequestBody Game game) throws BadRequestException {

        if (game.getDifficulty() == null) throw new BadRequestException("Difficulty wasn't specified");
        if (game.getBoard() == null) throw new BadRequestException("Board wasn't specified");
        if (game.getName() == null) throw new BadRequestException("Name wasn't specified");
        try
        {
            Game oldEntity = gameRepository.findById(uuid).get();
            List<List<String>> board = game.getBoard();
            oldEntity.setBoard(board);
            oldEntity.setName(game.getName());
            oldEntity.setDifficulty(game.getDifficulty());
            oldEntity.setGameState(new Board(board).getState());
            oldEntity.setUpdatedAt(LocalDateTime.now().toString());
            return gameRepository.saveAndFlush(oldEntity);
        }catch (NoSuchElementException exception){
            throw new ResourceNotFound();
        }
    }
}
