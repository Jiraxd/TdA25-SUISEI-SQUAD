package com.tda25be.tda25be;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {

        // Route to serve game.html for /game/{id} pattern

        // Kvůli limitacím v odevzdávání (aspon jsem nepřišel na to, jak nahrát 2 docker image aby byly funčkní :D )
        // a našemu výberu tech-stacku jsme se rozhodli využít backend pro forwardování requestu
        registry.addViewController("/game/{id:.*}")
                .setViewName("forward:/game.html");

        registry.addViewController("/game")
                .setViewName("forward:/game.html");

        registry.addViewController("/game/")
                .setViewName("forward:/game.html");

        registry.addViewController("/games/")
                .setViewName("forward:/games.html");
        
        registry.addViewController("/games")
                .setViewName("forward:/games.html");

        registry.addViewController("/edit/{id:.*}")
                .setViewName("forward:/edit.html");

        registry.addViewController("/edit")
                .setViewName("forward:/edit.html");

        registry.addViewController("/edit/")
                .setViewName("forward:/edit.html");
    }
}
