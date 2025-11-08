package com.example.__Blog;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.__Blog.model.User;
import com.example.__Blog.service.admineService;

@Component
public class AdminCreator implements CommandLineRunner {

    private final admineService admineService;

    public AdminCreator(admineService admineService) {
        this.admineService = admineService;
    }

    @Override
    public void run(String... args) throws Exception {
        User user = admineService.createAdmin("Genghis", "Genghis khan", "I’m Genghis Khan — mighty admin of this realm.\n" + //
                        "Dictator? Please. I only command the backend.","Genghis khan", "http://localhost:8080/api/files/admin.jpg");
        if (user == null) {
            System.exit(1);
        }
    }
}
