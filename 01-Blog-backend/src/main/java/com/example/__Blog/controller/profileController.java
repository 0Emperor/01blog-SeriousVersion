package com.example.__Blog.controller;

// import java.util.ArrayList;
// import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.__Blog.dto.userResponse;

@RestController
@RequestMapping("/api/profile")
public class profileController {
    @GetMapping("/{name}")
    public userResponse getOthersProfiles(@PathVariable String name) {
        return new userResponse();
    }

    @GetMapping("")
    public userResponse getProfile() {
        return new userResponse();
    }

    // @GetMapping("/discover")
    // public List<userResponse> getAllPeople() {
    //     List l = new ArrayList<>();
    //     l.add(new userResponse());
    //     return l;
    // }
}
