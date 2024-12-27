package com.tda25be.tda25be.api;

import com.tda25be.tda25be.enums.GameState;
import com.tda25be.tda25be.error.ResourceNotFound;
import com.tda25be.tda25be.error.SemanticErrorException;
import com.tda25be.tda25be.models.Board;
import com.tda25be.tda25be.models.Game;
import com.tda25be.tda25be.models.OrganizationResponse;
import com.tda25be.tda25be.entities.GameEntity;
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
        game.setGameState(new Board(board).getState());  //TODO calculate gamestate
        parseBoardArray(board);
        return Game.fromEntity(gameRepository.saveAndFlush(GameEntity.fromGame(game)));
    }
    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path="/games" )
    public List<Game> getAllGames(){
        List<Game> games = new ArrayList<>();
        for (GameEntity entity : gameRepository.findAll()) {
            games.add(Game.fromEntity(entity));
        }
        return games;
    }
    @ResponseStatus(HttpStatus.OK)
    @GetMapping(path="/games/{uuid}")
    public Game getGame(@PathVariable String uuid){
        try {
            return Game.fromEntity(gameRepository.findById(uuid).get());
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
    @ResponseStatus(HttpStatus.OK) //test this more, if parse works and semantic error is blocking
    @PutMapping(path="/games/{uuid}")
    public Game updateGame(@PathVariable String uuid, @RequestBody Game game) throws BadRequestException {
        GameEntity entity = GameEntity.fromGame(game);
        if (game.getDifficulty() == null) throw new BadRequestException("Difficulty wasn't specified");
        if (game.getBoard() == null) throw new BadRequestException("Board wasn't specified");
        if (game.getName() == null) throw new BadRequestException("Name wasn't specified");
        try
        {
            GameEntity oldEntity = gameRepository.findById(uuid).get();

            List<List<String>> board = entity.getBoard();
            parseBoardArray(board);

            oldEntity.setBoard(board);
            oldEntity.setName(entity.getName());
            oldEntity.setDifficulty(entity.getDifficulty());
            oldEntity.setUpdatedAt(LocalDateTime.now().toString());

            return Game.fromEntity(gameRepository.saveAndFlush(oldEntity));
        }catch (NoSuchElementException exception){
            throw new ResourceNotFound();
        }
    }

    private void parseBoardArray(List<List<String>> board) {
        for (List<String> row : board) {
            for (int j = 0; j < 15; j++) {
                if(row.size() != 15) throw new SemanticErrorException("Board isn't 15x15");
                String cell = row.get(j).toUpperCase();
                if (!cell.isEmpty() && !cell.equals("X") && !cell.equals("O")) {
                    throw new SemanticErrorException(String.format("Semantic error: board can only contain X's and O's, yours contains %s", cell));
                }
                row.set(j, cell);
            }
        }
    }

}
