package com.example.backend.web;

import com.example.backend.dto.skill.SkillDto;
import com.example.backend.dto.user.UserSkillSearchDto;
import com.example.backend.payloads.skill.SkillPayload;
import com.example.backend.security.JwtUserPrincipal;
import com.example.backend.services.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping("/skills")
    public List<SkillDto> search(@RequestParam(required = false) String query) {
        return skillService.search(query);
    }

    @GetMapping("/users/search")
    public List<UserSkillSearchDto> searchUsersBySkill(@RequestParam String skill) {
        return skillService.searchUsersBySkill(skill);
    }

    @PostMapping("/users/me/skills")
    @ResponseStatus(HttpStatus.CREATED)
    public SkillDto createForCurrentUser(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @Valid @RequestBody SkillPayload payload
    ) {
        return skillService.createForUser(
                principal.userId(), payload.name(), payload.description(), payload.price()
        );
    }

    @PutMapping("/users/me/skills/{skillId}")
    public SkillDto updateForCurrentUser(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable java.util.UUID skillId,
            @Valid @RequestBody SkillPayload payload
    ) {
        return skillService.updateForUser(
                principal.userId(), skillId, payload.name(), payload.description(), payload.price()
        );
    }

    @DeleteMapping("/users/me/skills/{skillId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteForCurrentUser(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable java.util.UUID skillId
    ) {
        skillService.deleteForUser(principal.userId(), skillId);
    }
}
