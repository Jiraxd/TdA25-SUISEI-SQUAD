package com.tda25be.tda25be.api;

import com.tda25be.tda25be.entities.Game;
import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.error.ResourceNotFound;
import com.tda25be.tda25be.models.Board;
import com.tda25be.tda25be.models.OrganizationResponse;
import com.tda25be.tda25be.repositories.GameRepository;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import com.tda25be.tda25be.services.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class GameController {

    private final GameRepository gameRepository;
    private final LiveGameRepo liveGameRepo;
    private final AuthService authService;

    @GetMapping(path = "/test")
    public OrganizationResponse api() {
        return new OrganizationResponse("Student Cyber Games");
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(path="/games")
    public Game createGame(@RequestBody Game game) throws BadRequestException {
        Board board = game.getBoard();
        if (game.getDifficulty() == null) throw new BadRequestException("Difficulty wasn't specified");
        if (game.getName() == null) throw new BadRequestException("Name wasn't specified");
        game.setCreatedAt(LocalDateTime.now().toString());
        game.setUpdatedAt(game.getCreatedAt());
        game.setGameState(board.getState());
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
            Board board = game.getBoard();
            oldEntity.setBoard(board);
            oldEntity.setName(game.getName());
            oldEntity.setDifficulty(game.getDifficulty());
            oldEntity.setGameState(board.getState());
            oldEntity.setUpdatedAt(LocalDateTime.now().toString());
            return gameRepository.saveAndFlush(oldEntity);
        }catch (NoSuchElementException exception){
            throw new ResourceNotFound();
        }
    }

    @GetMapping("/liveGameToken")
    public ResponseEntity<LiveGame> liveGameToken(@RequestHeader("Authorization") String token){
        if(token == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        User user = authService.verify(token);
        if(user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        LiveGame liveGame = liveGameRepo.findLiveGameByUser(user);
        return ResponseEntity.status(HttpStatus.OK).body(liveGame);
    }
    @GetMapping("/liveGameById")
    public ResponseEntity<LiveGame> liveGameById(@RequestParam String id){
        if(id == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        LiveGame liveGame = liveGameRepo.findById(id).orElse(null);
        if(liveGame == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.status(HttpStatus.OK).body(liveGame);
    }
    @GetMapping("/liveGameByUserId/{uuid}")
    public ResponseEntity<List<LiveGame>> liveGameByUserId(@PathVariable String uuid){
        if(uuid == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        return new ResponseEntity<>(liveGameRepo.findLiveGameByUserId(uuid), HttpStatus.OK);
    }
}
