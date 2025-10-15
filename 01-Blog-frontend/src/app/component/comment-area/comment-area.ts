import { Component } from '@angular/core';
import { CommentAdd } from "../comment-add/comment-add";
import { CommentCard } from '../comment-card/comment-card';
import { Comment, Post, User } from '../../dto/dto';

@Component({
  selector: 'app-comment-area',
  imports: [CommentAdd, CommentCard],
  templateUrl: './comment-area.html',
  styleUrl: './comment-area.scss'
})
export class CommentArea {
  user: User = {
    id: "u123",
    username: "techExplorer",
    role: "beta",
    bio: "Loves building modern web apps with Angular & Spring Boot.",
    profile: "https://example.com/profiles/techExplorer.png"
  };

  post: Post = {
    postId: "p456",
    title: "Building a Fullstack App with Angular & Spring Boot",
    description: "A walkthrough of how Angular integrates with Spring Boot REST APIs.",
    mediaUrl: [
      "https://example.com/images/angular-spring-1.png",
      "https://example.com/images/angular-spring-2.png"
    ],
    createdAt: new Date("2025-10-01T10:00:00Z"),
    user: this.user,
    totalLikes: 42,
    totalComments: 5,
    isLiked: false,
    isOwn: true
  };

  comments: Comment[] = [
    {
      id: "c001",
      post: this.post,
      user: this.user,
      createdAt: new Date("2025-10-01T11:00:00Z"),
      content: "This guide really helped me connect Angular to my Spring backend. Thanks!"
    },
    {
      id: "c002",
      post: this.post,
      user: this.user,
      createdAt: new Date("2025-10-01T12:15:00Z"),
      content: "Could you make a follow-up showing authentication with JWT?"
    },
    {
      id: "c003",
      post: this.post,
      user: this.user,
      createdAt: new Date("2025-10-01T13:30:00Z"),
      content: "I had issues with CORS initially, but your setup worked perfectly."
    },
    {
      id: "c004",
      post: this.post,
      user: this.user,
      createdAt: new Date("2025-10-01T14:45:00Z"),
      content: "Would love to see how to deploy this fullstack app on AWS!"
    },
    {
      id: "c005",
      post: this.post,
      user: this.user,
      createdAt: new Date("2025-10-01T15:20:00Z"),
      content: "Angular 18 and Spring Boot 3 really make a great combo!"
    }
  ];
}
