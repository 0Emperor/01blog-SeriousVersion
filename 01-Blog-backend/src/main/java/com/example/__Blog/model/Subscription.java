package com.example.__Blog.model;

import java.sql.Timestamp;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "subscriptions")
public class Subscription {
    public Subscription() {
        createdAt = new Timestamp(System.currentTimeMillis());
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "subscriber_id")
    private User subscriber;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "subscribed_to_id")
    private User subscribedTo;

    private Timestamp createdAt;

    public void setSubscribedTo(User subscribedTo) {
        this.subscribedTo = subscribedTo;
    }

    public void setSubscriber(User subscriber) {
        this.subscriber = subscriber;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public User getSubscribedTo() {
        return subscribedTo;
    }

    public User getSubscriber() {
        return subscriber;
    }
}
