package com.tda25be.tda25be.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Kvůli limitacím v odevzdávání (nepřišel jsem na způsob, jak nahrát dva funkční Docker image)
        // a našemu výběru tech-stacku jsme se rozhodli využít backend pro forwardování requestů.

        registerRoutes(registry, "game");
        registerRoutes(registry, "games");
        registerRoutes(registry, "edit");
        registerRoutes(registry, "online");
        registerRoutes(registry, "profile");
        registerRoutes(registry, "login");
        registerRoutes(registry, "register");
        registerRoutes(registry, "privacy");
        registerRoutes(registry, "copyright");
        registerRoutes(registry, "contact");
        registerRoutes(registry, "terms");

        // Special cases with dynamic IDs
        registry.addViewController("/edit/{id:.*}").setViewName("forward:/edit.html");
        registry.addViewController("/game/{id:.*}").setViewName("forward:/game.html");
        registry.addViewController("/profile/{id:.*}").setViewName("forward:/profile.html");
        registry.addViewController("/onlineGame/{id:.*}").setViewName("forward:/onlineGame.html");
    }

    private void registerRoutes(ViewControllerRegistry registry, String route) {
        registry.addViewController("/" + route).setViewName("forward:/" + route + ".html");
        registry.addViewController("/" + route + "/").setViewName("forward:/" + route + ".html");
    }
}
