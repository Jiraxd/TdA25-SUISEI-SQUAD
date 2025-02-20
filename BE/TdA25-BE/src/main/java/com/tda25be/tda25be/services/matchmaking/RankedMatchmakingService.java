package com.tda25be.tda25be.services.matchmaking;

import com.tda25be.tda25be.WebSocketUtil;
import com.tda25be.tda25be.entities.User;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import org.springframework.stereotype.Service;
@Service
public class RankedMatchmakingService extends MatchmakingService {

    private static final int ELO_THRESHOLD = 200;

    public RankedMatchmakingService(WebSocketUtil webSocketUtil) {
        super(webSocketUtil);
    }

    @Override
    protected boolean isValidMatch(User user, User opponent) {
        return Math.abs(user.getElo() - opponent.getElo()) <= ELO_THRESHOLD;
    }
}
