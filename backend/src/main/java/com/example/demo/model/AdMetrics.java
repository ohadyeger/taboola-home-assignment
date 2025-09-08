package com.example.demo.model;

import java.math.BigDecimal;
import java.util.UUID;

public class AdMetrics {
    private String day;
    private String week;
    private String month;
    private UUID accountId;
    private String campaign;
    private String country;
    private String platform;
    private String browser;
    private BigDecimal spent;
    private long impressions;
    private long clicks;

    public AdMetrics(String day, String week, String month, UUID accountId, String campaign, 
                     String country, String platform, String browser, BigDecimal spent, 
                     long impressions, long clicks) {
        this.day = day;
        this.week = week;
        this.month = month;
        this.accountId = accountId;
        this.campaign = campaign;
        this.country = country;
        this.platform = platform;
        this.browser = browser;
        this.spent = spent;
        this.impressions = impressions;
        this.clicks = clicks;
    }

    public String getDay() { return day; }
    public String getWeek() { return week; }
    public String getMonth() { return month; }
    public UUID getAccountId() { return accountId; }
    public String getCampaign() { return campaign; }
    public String getCountry() { return country; }
    public String getPlatform() { return platform; }
    public String getBrowser() { return browser; }
    public BigDecimal getSpent() { return spent; }
    public long getImpressions() { return impressions; }
    public long getClicks() { return clicks; }
}
