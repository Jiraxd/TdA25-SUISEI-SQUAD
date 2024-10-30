package com.tda25be.tda25be.api;

import com.tda25be.tda25be.models.OrganizationResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class Controller {

    @GetMapping
    public OrganizationResponse api() {
        return new OrganizationResponse("Student Cyber Games");
    }
}
