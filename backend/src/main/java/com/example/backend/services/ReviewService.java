package com.example.backend.services;

import com.example.backend.dto.review.ReviewDto;
import com.example.backend.payloads.review.ReviewPayload;

import java.util.List;
import java.util.UUID;

public interface ReviewService {
    ReviewDto create(UUID reviewerId, UUID skillId, ReviewPayload payload);
    List<ReviewDto> findForSkill(UUID skillId);
}
