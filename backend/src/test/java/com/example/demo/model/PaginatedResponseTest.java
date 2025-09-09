package com.example.demo.model;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PaginatedResponseTest {

    @Test
    void constructor_WithValidData_ShouldCreateInstance() {
        // Arrange
        List<String> data = Arrays.asList("item1", "item2", "item3");
        int page = 0;
        int totalPages = 2;
        long totalElements = 5L;
        int size = 3;

        // Act
        PaginatedResponse<String> paginatedResponse = new PaginatedResponse<>(data, page, totalPages, totalElements, size);

        // Assert
        assertNotNull(paginatedResponse);
        assertEquals(data, paginatedResponse.getData());
        assertEquals(page, paginatedResponse.getCurrentPage());
        assertEquals(totalPages, paginatedResponse.getTotalPages());
        assertEquals(totalElements, paginatedResponse.getTotalElements());
        assertEquals(size, paginatedResponse.getPageSize());
    }

    @Test
    void constructor_WithEmptyData_ShouldCreateInstance() {
        // Arrange
        List<String> data = Arrays.asList();
        int page = 0;
        int totalPages = 0;
        long totalElements = 0L;
        int size = 10;

        // Act
        PaginatedResponse<String> paginatedResponse = new PaginatedResponse<>(data, page, totalPages, totalElements, size);

        // Assert
        assertNotNull(paginatedResponse);
        assertNotNull(paginatedResponse.getData());
        assertTrue(paginatedResponse.getData().isEmpty());
        assertEquals(page, paginatedResponse.getCurrentPage());
        assertEquals(totalPages, paginatedResponse.getTotalPages());
        assertEquals(totalElements, paginatedResponse.getTotalElements());
        assertEquals(size, paginatedResponse.getPageSize());
    }

    @Test
    void constructor_WithNullData_ShouldCreateInstance() {
        // Arrange
        List<String> data = null;
        int page = 0;
        int totalPages = 0;
        long totalElements = 0L;
        int size = 10;

        // Act
        PaginatedResponse<String> paginatedResponse = new PaginatedResponse<>(data, page, totalPages, totalElements, size);

        // Assert
        assertNotNull(paginatedResponse);
        assertNull(paginatedResponse.getData());
        assertEquals(page, paginatedResponse.getCurrentPage());
        assertEquals(totalPages, paginatedResponse.getTotalPages());
        assertEquals(totalElements, paginatedResponse.getTotalElements());
        assertEquals(size, paginatedResponse.getPageSize());
    }

    @Test
    void constructor_WithNegativeValues_ShouldCreateInstance() {
        // Arrange
        List<String> data = Arrays.asList("item1");
        int page = -1;
        int totalPages = -1;
        long totalElements = -1L;
        int size = -1;

        // Act
        PaginatedResponse<String> paginatedResponse = new PaginatedResponse<>(data, page, totalPages, totalElements, size);

        // Assert
        assertNotNull(paginatedResponse);
        assertEquals(data, paginatedResponse.getData());
        assertEquals(page, paginatedResponse.getCurrentPage());
        assertEquals(totalPages, paginatedResponse.getTotalPages());
        assertEquals(totalElements, paginatedResponse.getTotalElements());
        assertEquals(size, paginatedResponse.getPageSize());
    }

    @Test
    void equals_WithSameData_ShouldReturnTrue() {
        // Arrange
        List<String> data1 = Arrays.asList("item1", "item2");
        List<String> data2 = Arrays.asList("item1", "item2");
        
        PaginatedResponse<String> paginatedResponse1 = new PaginatedResponse<>(data1, 0, 1, 2L, 10);
        PaginatedResponse<String> paginatedResponse2 = new PaginatedResponse<>(data2, 0, 1, 2L, 10);

        // Act & Assert
        assertEquals(paginatedResponse1, paginatedResponse2);
    }

    @Test
    void equals_WithDifferentData_ShouldReturnFalse() {
        // Arrange
        List<String> data1 = Arrays.asList("item1", "item2");
        List<String> data2 = Arrays.asList("item1", "item3");
        
        PaginatedResponse<String> paginatedResponse1 = new PaginatedResponse<>(data1, 0, 1, 2L, 10);
        PaginatedResponse<String> paginatedResponse2 = new PaginatedResponse<>(data2, 0, 1, 2L, 10);

        // Act & Assert
        assertNotEquals(paginatedResponse1, paginatedResponse2);
    }

    @Test
    void equals_WithDifferentPage_ShouldReturnFalse() {
        // Arrange
        List<String> data = Arrays.asList("item1", "item2");
        
        PaginatedResponse<String> paginatedResponse1 = new PaginatedResponse<>(data, 0, 1, 2L, 10);
        PaginatedResponse<String> paginatedResponse2 = new PaginatedResponse<>(data, 1, 1, 2L, 10);

        // Act & Assert
        assertNotEquals(paginatedResponse1, paginatedResponse2);
    }

    @Test
    void hashCode_WithSameData_ShouldReturnSameHashCode() {
        // Arrange
        List<String> data1 = Arrays.asList("item1", "item2");
        List<String> data2 = Arrays.asList("item1", "item2");
        
        PaginatedResponse<String> paginatedResponse1 = new PaginatedResponse<>(data1, 0, 1, 2L, 10);
        PaginatedResponse<String> paginatedResponse2 = new PaginatedResponse<>(data2, 0, 1, 2L, 10);

        // Act & Assert
        assertEquals(paginatedResponse1.hashCode(), paginatedResponse2.hashCode());
    }

    @Test
    void toString_ShouldReturnStringRepresentation() {
        // Arrange
        List<String> data = Arrays.asList("item1", "item2");
        PaginatedResponse<String> paginatedResponse = new PaginatedResponse<>(data, 0, 1, 2L, 10);

        // Act
        String result = paginatedResponse.toString();

        // Assert
        assertNotNull(result);
        assertTrue(result.contains("item1"));
        assertTrue(result.contains("item2"));
    }

    @Test
    void hasNext_WhenPageLessThanTotalPages_ShouldReturnTrue() {
        // Arrange
        List<String> data = Arrays.asList("item1");
        PaginatedResponse<String> paginatedResponse = new PaginatedResponse<>(data, 0, 2, 2L, 1);

        // Act & Assert
        assertTrue(paginatedResponse.isHasNext());
    }

    @Test
    void hasNext_WhenPageEqualsTotalPages_ShouldReturnFalse() {
        // Arrange
        List<String> data = Arrays.asList("item1");
        PaginatedResponse<String> paginatedResponse = new PaginatedResponse<>(data, 1, 2, 2L, 1);

        // Act & Assert
        assertFalse(paginatedResponse.isHasNext());
    }

    @Test
    void hasPrevious_WhenPageGreaterThanZero_ShouldReturnTrue() {
        // Arrange
        List<String> data = Arrays.asList("item1");
        PaginatedResponse<String> paginatedResponse = new PaginatedResponse<>(data, 1, 2, 2L, 1);

        // Act & Assert
        assertTrue(paginatedResponse.isHasPrevious());
    }

    @Test
    void hasPrevious_WhenPageEqualsZero_ShouldReturnFalse() {
        // Arrange
        List<String> data = Arrays.asList("item1");
        PaginatedResponse<String> paginatedResponse = new PaginatedResponse<>(data, 0, 2, 2L, 1);

        // Act & Assert
        assertFalse(paginatedResponse.isHasPrevious());
    }
}
