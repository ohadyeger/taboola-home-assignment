package com.example.demo.model;

import java.util.List;
import java.util.Objects;

public class PaginatedResponse<T> {
    private List<T> data;
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private int pageSize;
    private boolean hasNext;
    private boolean hasPrevious;

    public PaginatedResponse() {}

    public PaginatedResponse(List<T> data, int currentPage, int totalPages, long totalElements, int pageSize) {
        this.data = data;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.pageSize = pageSize;
        this.hasNext = currentPage < totalPages - 1;
        this.hasPrevious = currentPage > 0;
    }

    // Getters and setters
    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public boolean isHasNext() {
        return hasNext;
    }

    public void setHasNext(boolean hasNext) {
        this.hasNext = hasNext;
    }

    public boolean isHasPrevious() {
        return hasPrevious;
    }

    public void setHasPrevious(boolean hasPrevious) {
        this.hasPrevious = hasPrevious;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PaginatedResponse<?> that = (PaginatedResponse<?>) o;
        return currentPage == that.currentPage &&
                totalPages == that.totalPages &&
                totalElements == that.totalElements &&
                pageSize == that.pageSize &&
                hasNext == that.hasNext &&
                hasPrevious == that.hasPrevious &&
                Objects.equals(data, that.data);
    }

    @Override
    public int hashCode() {
        return Objects.hash(data, currentPage, totalPages, totalElements, pageSize, hasNext, hasPrevious);
    }

    @Override
    public String toString() {
        return "PaginatedResponse{" +
                "data=" + data +
                ", currentPage=" + currentPage +
                ", totalPages=" + totalPages +
                ", totalElements=" + totalElements +
                ", pageSize=" + pageSize +
                ", hasNext=" + hasNext +
                ", hasPrevious=" + hasPrevious +
                '}';
    }
}
