package com.example.__Blog;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.__Blog.model.User;
import com.example.__Blog.service.admineService;

import java.util.Scanner;

@Component
public class AdminCreator implements CommandLineRunner {

    private final admineService admineService;

    public AdminCreator(admineService admineService) {
        this.admineService = admineService;
    }

    @Override
    public void run(String... args) throws Exception {
        if (args.length > 0 && "createAdmin".equals(args[0])) {
            Scanner scanner = new Scanner(System.in);
            System.out.print("Enter admin username: ");
            String username = scanner.nextLine();
            System.out.print("Enter admin password: ");
            String password = scanner.nextLine();
            User user = admineService.createAdmin(username, password);
            if (user == null) {
                System.out.println("failed to create admine");
                System.exit(1);
            }
            System.out.println("Admin created: " + username);
            scanner.close();
            System.exit(0);
        }
    }
}
