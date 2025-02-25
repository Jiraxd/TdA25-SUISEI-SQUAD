package com.tda25be.tda25be.api;

import com.tda25be.tda25be.entities.Game;
import com.tda25be.tda25be.entities.LiveGame;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.error.SemanticErrorException;
import com.tda25be.tda25be.models.Board;
import com.tda25be.tda25be.models.GameRequest;
import com.tda25be.tda25be.models.OrganizationResponse;
import com.tda25be.tda25be.repositories.GameRepository;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import com.tda25be.tda25be.services.auth.AuthService;
import com.tda25be.tda25be.services.liveGameService.LiveGameService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    private final LiveGameService liveGameService;

    @GetMapping(path = "/test")
    public OrganizationResponse api() {
        return new OrganizationResponse("Student Cyber Games");
    }

    @PostMapping("/games")
    public ResponseEntity<Game> createGame(@RequestBody GameRequest game) {
        if (game.getDifficulty() == null)  return ResponseEntity.badRequest().build();
        if (game.getName() == null) return ResponseEntity.badRequest().build();
        Game newGame = new Game();
        Board board;
        try {
             board = new Board(game.getBoard());
        }catch (SemanticErrorException | BadRequestException e){
            return ResponseEntity.badRequest().build();
        }
        newGame.setName(game.getName()).setDifficulty(game.getDifficulty()).setGameState(board.getState()).setBoard(board);
        gameRepository.saveAndFlush(newGame);
        return ResponseEntity.status(HttpStatus.CREATED).body(newGame);
    }

    @GetMapping("/games" )
    public ResponseEntity<List<Game>> getAllGames(){
        return ResponseEntity.ok(new ArrayList<>(gameRepository.findAll()));
    }

    @GetMapping(path="/games/{uuid}")
    public ResponseEntity<Game> getGame(@PathVariable String uuid){
        try {
            return ResponseEntity.ok().body(gameRepository.findById(uuid).get());
        }
        catch (NoSuchElementException exception){
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/games/{uuid}")
    public void deleteGame(@PathVariable String uuid) {
        try {
            gameRepository.deleteById(uuid);
        } catch (NoSuchElementException ignored) {}
    }

    @PutMapping(path="/games/{uuid}")
    public ResponseEntity<Game> updateGame(@PathVariable String uuid, @RequestBody GameRequest game) throws BadRequestException {

        if (game.getDifficulty() == null) ResponseEntity.badRequest().build();
        if (game.getBoard() == null) ResponseEntity.badRequest().build();
        if (game.getName() == null) ResponseEntity.badRequest().build();
        Game newGame = new Game();
        Board board;
        try {
            board = new Board(game.getBoard());
        }catch (SemanticErrorException | BadRequestException e){
            return ResponseEntity.badRequest().build();
        }
        newGame.setName(game.getName()).setDifficulty(game.getDifficulty()).setGameState(board.getState()).setBoard(board).setUuid(uuid);
        gameRepository.saveAndFlush(newGame);
        return ResponseEntity.ok(newGame);
    }

    @GetMapping("/currentLiveGame")
    public ResponseEntity<LiveGame> getCurrentLiveGame(@RequestHeader("Authorization") String token){
        User user = authService.verify(token);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        LiveGame livegame = liveGameRepo.findLiveGameByUserAndInProgress(user);
        if(livegame == null) return ResponseEntity.notFound().build();
        livegame.updateTime();
        liveGameRepo.saveAndFlush(livegame);
        return ResponseEntity.ok(livegame);
    }
    @GetMapping("/liveGameToken")
    public ResponseEntity<List<LiveGame>> liveGameToken(@RequestHeader("Authorization") String token){
        if(token == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        User user = authService.verify(token);
        if(user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        List<LiveGame> liveGame = liveGameRepo.findLiveGameByUser(user);
        return ResponseEntity.status(HttpStatus.OK).body(liveGame);
    }
    @GetMapping("/liveGameById/{uuid}")
    public ResponseEntity<LiveGame> liveGameById(@PathVariable String uuid){
        if(uuid == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        LiveGame liveGame = liveGameRepo.findById(uuid).orElse(null);
        if(liveGame == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        liveGame.updateTime();
        liveGameRepo.saveAndFlush(liveGame);
        return ResponseEntity.status(HttpStatus.OK).body(liveGame);
    }
    @GetMapping("/liveGameByUserId/{uuid}")
    public ResponseEntity<List<LiveGame>> liveGameByUserId(@PathVariable String uuid){
        if(uuid == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        return new ResponseEntity<>(liveGameRepo.findLiveGameByUserId(uuid), HttpStatus.OK);
    }
    @GetMapping("/surrender")
    public ResponseEntity<String> surrender(@RequestHeader("Authorization") String token){
        User user = authService.verify(token);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        LiveGame livegame = liveGameRepo.findLiveGameByUserAndInProgress(user);
        if(livegame == null) return ResponseEntity.notFound().build();
        if(livegame.getPlayerO().getUuid().equals(user.getUuid())){
             liveGameService.win(livegame, "X");
        }
        else if(livegame.getPlayerX().getUuid().equals(user.getUuid())){
            liveGameService.win(livegame, "O");
        }
        return ResponseEntity.ok().build();
    }
    @GetMapping("/test2")
    public void test(){
        LiveGame liveGame = liveGameRepo.findById("5d3ab0f3-6145-4868-aaff-8d904e7a743b").get();
        liveGame.getBoard().checkWinner();
    }
}
