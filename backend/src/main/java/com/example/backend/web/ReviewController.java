package com.example.backend.web;

import com.example.backend.dto.review.ReviewDto;
import com.example.backend.payloads.review.ReviewPayload;
import com.example.backend.security.JwtUserPrincipal;
import com.example.backend.services.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/skills/{skillId}/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewDto create(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID skillId,
            @Valid @RequestBody ReviewPayload payload
    ) {
        return reviewService.create(principal.userId(), skillId, payload);
    }

    @GetMapping("/skills/{skillId}/reviews")
    public List<ReviewDto> findForSkill(@PathVariable UUID skillId) {
        return reviewService.findForSkill(skillId);
    }
}
