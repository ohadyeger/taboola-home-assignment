package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DataSourceConfig {

    @Value("${DB_URL}")
    private String dbUrl;

    @Value("${DB_USERNAME:default}")
    private String dbUsername;

    @Value("${DB_PASSWORD:}")
    private String dbPassword;

    @Bean
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        // Disable compression to avoid missing native libs, and use gzip if needed
        String jdbcUrl = dbUrl.contains("?") ? dbUrl + "&compress=0" : dbUrl + "?compress=0";
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(dbUsername);
        config.setPassword(dbPassword);
        config.setDriverClassName("com.clickhouse.jdbc.ClickHouseDriver");
        config.setMaximumPoolSize(5);
        config.setMinimumIdle(1);
        return new HikariDataSource(config);
    }

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}


