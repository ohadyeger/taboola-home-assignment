package com.example.demo.model;

import java.math.BigDecimal;
import java.util.Objects;
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
    private Long impressions;
    private Long clicks;

    public AdMetrics(String day, String week, String month, UUID accountId, String campaign, 
                     String country, String platform, String browser, BigDecimal spent, 
                     Long impressions, Long clicks) {
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
    public Long getImpressions() { return impressions; }
    public Long getClicks() { return clicks; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AdMetrics adMetrics = (AdMetrics) o;
        return Objects.equals(day, adMetrics.day) &&
                Objects.equals(week, adMetrics.week) &&
                Objects.equals(month, adMetrics.month) &&
                Objects.equals(accountId, adMetrics.accountId) &&
                Objects.equals(campaign, adMetrics.campaign) &&
                Objects.equals(country, adMetrics.country) &&
                Objects.equals(platform, adMetrics.platform) &&
                Objects.equals(browser, adMetrics.browser) &&
                Objects.equals(spent, adMetrics.spent) &&
                Objects.equals(impressions, adMetrics.impressions) &&
                Objects.equals(clicks, adMetrics.clicks);
    }

    @Override
    public int hashCode() {
        return Objects.hash(day, week, month, accountId, campaign, country, platform, browser, spent, impressions, clicks);
    }

    @Override
    public String toString() {
        return "AdMetrics{" +
                "day='" + day + '\'' +
                ", week='" + week + '\'' +
                ", month='" + month + '\'' +
                ", accountId=" + accountId +
                ", campaign='" + campaign + '\'' +
                ", country='" + country + '\'' +
                ", platform='" + platform + '\'' +
                ", browser='" + browser + '\'' +
                ", spent=" + spent +
                ", impressions=" + impressions +
                ", clicks=" + clicks +
                '}';
    }
}
