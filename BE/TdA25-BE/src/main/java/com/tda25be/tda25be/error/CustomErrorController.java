package com.tda25be.tda25be.error;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;


@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request, HttpServletResponse response) {
        int statusCode = response.getStatus();

        if (statusCode == 0 || statusCode == 200) {
            Object status = request.getAttribute("javax.servlet.error.status_code");
            if (status != null) {
                statusCode = (int) status;
            } else {
                statusCode = 500;  // Default to 500
            }
        }

        return "redirect:/errorPage.html?code=" + statusCode;
    }
}
