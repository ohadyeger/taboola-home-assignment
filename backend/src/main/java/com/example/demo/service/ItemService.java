package com.example.demo.service;

import com.example.demo.model.Item;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {
    private final JdbcTemplate jdbcTemplate;

    public ItemService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Item> getAllItems() {
        return jdbcTemplate.query("SELECT id, name, toString(created_at) as created_at FROM appdb.items ORDER BY id",
                (rs, rowNum) -> new Item(
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("created_at")
                )
        );
    }
}


