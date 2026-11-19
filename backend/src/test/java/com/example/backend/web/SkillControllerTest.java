package com.example.backend.web;

import com.example.backend.dto.skill.SkillDto;
import com.example.backend.payloads.skill.SkillPayload;
import com.example.backend.security.JwtUserPrincipal;
import com.example.backend.services.SkillService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class SkillControllerTest {

    @Mock
    private SkillService skillService;

    private MockMvc mockMvc;
    private SkillController controller;

    @BeforeEach
    void setUp() {
        controller = new SkillController(skillService);
        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void listsSkillsByQuery() throws Exception {
        UUID skillId = UUID.randomUUID();
        when(skillService.search("java"))
                .thenReturn(List.of(new SkillDto(skillId, "Java", 25L)));

        mockMvc.perform(get("/api/skills").param("query", "java"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(skillId.toString()))
                .andExpect(jsonPath("$[0].name").value("Java"))
                .andExpect(jsonPath("$[0].price").value(25));
    }

    @Test
    void attachesSkillForAuthenticatedPrincipal() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID skillId = UUID.randomUUID();
        when(skillService.createForUser(userId, "Java", 25L))
                .thenReturn(new SkillDto(skillId, "Java", 25L));

        var result = controller.createForCurrentUser(
                new JwtUserPrincipal(userId, "student@example.com", "STUDENT"),
                new SkillPayload("Java", 25L)
        );

        assertEquals(skillId, result.id());
        assertEquals("Java", result.name());
        assertEquals(25L, result.price());
        verify(skillService).createForUser(userId, "Java", 25L);
    }

    @Test
    void alwaysUsesAuthenticatedPrincipalIdForAttachment() throws Exception {
        UUID authenticatedUserId = UUID.randomUUID();
        UUID skillId = UUID.randomUUID();
        when(skillService.createForUser(authenticatedUserId, "Java", 25L))
                .thenReturn(new SkillDto(skillId, "Java", 25L));

        controller.createForCurrentUser(
                new JwtUserPrincipal(authenticatedUserId, "student@example.com", "STUDENT"),
                new SkillPayload("Java", 25L)
        );

        verify(skillService).createForUser(authenticatedUserId, "Java", 25L);
    }

    @Test
    void rejectsInvalidSkillPayload() throws Exception {
        mockMvc.perform(post("/api/users/me/skills")
                        .contentType("application/json")
                        .content("""
                                {"name":" ","price":25}
                                """))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(skillService);
    }
}
