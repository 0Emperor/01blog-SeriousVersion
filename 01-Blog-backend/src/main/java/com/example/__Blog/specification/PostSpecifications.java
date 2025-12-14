package com.example.__Blog.specification;

import org.springframework.data.jpa.domain.Specification;
import com.example.__Blog.model.Post;
import java.util.UUID;

public class PostSpecifications {
    public static Specification<Post> byUserId(UUID id) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), id);
    }

    public static Specification<Post> byUserName(String name) {
        return (root, query, cb) -> cb.equal(root.get("user").get("username"), name);
    }

    public static Specification<Post> notHidden() {
        return (root, query, cb) -> cb.equal(root.get("hidden"), false);
    }
}
