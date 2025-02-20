package com.tda25be.tda25be.services.matchmaking;

import com.tda25be.tda25be.WebSocketUtil;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service
public class UnrankedMatchmakingService extends MatchmakingService {

    public UnrankedMatchmakingService(WebSocketUtil webSocketUtil, LiveGameRepo liveGameRepo) {
        super(webSocketUtil, liveGameRepo);
    }

    @Override
    protected boolean isValidMatch(User user, User opponent) {
        return true;
    }
}
