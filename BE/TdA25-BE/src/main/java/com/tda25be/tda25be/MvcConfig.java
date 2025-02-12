package com.tda25be.tda25be;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Kvůli limitacím v odevzdávání (nepřišel jsem na způsob, jak nahrát dva funkční Docker image)
        // a našemu výběru tech-stacku jsme se rozhodli využít backend pro forwardování requestů.

        registerRoute(registry, "/game{slash:.*}", "game.html");
        registerRoute(registry, "/games{slash:.*}", "games.html");
        registerRoute(registry, "/edit{slash:.*}", "edit.html");
        registerRoute(registry, "/online{slash:.*}", "online.html");
        registerRoute(registry, "/profile{slash:.*}", "profile.html");
        registerRoute(registry, "/onlineGame/{id:.*}", "onlineGame.html");
        registerRoute(registry, "/login{slash:.*}", "login.html");
        registerRoute(registry, "/register{slash:.*}", "register.html");
    }

    private void registerRoute(ViewControllerRegistry registry, String path, String view) {
        registry.addViewController(path).setViewName("forward:/" + view);
    }
}
