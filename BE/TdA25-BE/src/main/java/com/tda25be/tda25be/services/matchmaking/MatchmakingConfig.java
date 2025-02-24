package com.tda25be.tda25be.services.matchmaking;

import com.tda25be.tda25be.WebSocketUtil;
import com.tda25be.tda25be.repositories.LiveGameRepo;
import com.tda25be.tda25be.services.matchmaking.MatchmakingService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MatchmakingConfig {

    @Bean
    public MatchmakingService matchmakingServiceRanked(WebSocketUtil webSocketUtil, LiveGameRepo liveGameRepo) {
        return new MatchmakingService(webSocketUtil, liveGameRepo, true); // Ranked = true
    }

    @Bean
    public MatchmakingService matchmakingServiceUnranked(WebSocketUtil webSocketUtil, LiveGameRepo liveGameRepo) {
        return new MatchmakingService(webSocketUtil, liveGameRepo, false); // Ranked = false
    }
}