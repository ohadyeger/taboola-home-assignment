package com.example.demo.model;

public class Item {
    private int id;
    private String name;
    private String createdAt;

    public Item(int id, String name, String createdAt) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public String getCreatedAt() { return createdAt; }
}


