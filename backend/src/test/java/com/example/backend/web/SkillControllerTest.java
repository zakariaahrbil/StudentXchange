package com.example.backend.web;

import com.example.backend.dto.skill.SkillDto;
import com.example.backend.dto.user.UserSkillSearchDto;
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
    void searchesUsersBySkill() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID skillId = UUID.randomUUID();
        when(skillService.searchUsersBySkill("java", null))
                .thenReturn(List.of(new UserSkillSearchDto(
                        userId, "Younes", "Student", "University", null,
                        "+212 600-000000", skillId, "Java", "Java tutoring", 25L, 4.5
                )));

        mockMvc.perform(get("/api/users/search").param("skill", "java"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].userId").value(userId.toString()))
                .andExpect(jsonPath("$[0].firstName").value("Younes"))
                .andExpect(jsonPath("$[0].lastName").value("Student"))
                .andExpect(jsonPath("$[0].phoneNumber").value("+212 600-000000"))
                .andExpect(jsonPath("$[0].skillId").value(skillId.toString()))
                .andExpect(jsonPath("$[0].skillName").value("Java"))
                .andExpect(jsonPath("$[0].skillDescription").value("Java tutoring"))
                .andExpect(jsonPath("$[0].skillPrice").value(25))
                .andExpect(jsonPath("$[0].skillRating").value(4.5));
    }

    @Test
    void optionalSkillSearchWithoutParameterReturnsEmptyDiscoveryResult() throws Exception {
        when(skillService.searchUsersBySkill(null, null)).thenReturn(List.of());

        mockMvc.perform(get("/api/users/search"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());

        verify(skillService).searchUsersBySkill(null, null);
    }

    @Test
    void findsSkillsForAuthenticatedPrincipal() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID skillId = UUID.randomUUID();
        when(skillService.findForUser(userId)).thenReturn(List.of(
                new SkillDto(skillId, "Java", "Backend tutoring", 25L)
        ));

        var result = controller.findForCurrentUser(
                new JwtUserPrincipal(userId, "student@example.com", "STUDENT")
        );

        assertEquals(1, result.size());
        assertEquals(skillId, result.get(0).id());
        assertEquals("Java", result.get(0).name());
        verify(skillService).findForUser(userId);
    }

    @Test
    void attachesSkillForAuthenticatedPrincipal() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID skillId = UUID.randomUUID();
        when(skillService.createForUser(userId, "Java", null, 25L))
                .thenReturn(new SkillDto(skillId, "Java", 25L));

        var result = controller.createForCurrentUser(
                new JwtUserPrincipal(userId, "student@example.com", "STUDENT"),
                new SkillPayload("Java", 25L)
        );

        assertEquals(skillId, result.id());
        assertEquals("Java", result.name());
        assertEquals(25L, result.price());
        verify(skillService).createForUser(userId, "Java", null, 25L);
    }

    @Test
    void alwaysUsesAuthenticatedPrincipalIdForAttachment() throws Exception {
        UUID authenticatedUserId = UUID.randomUUID();
        UUID skillId = UUID.randomUUID();
        when(skillService.createForUser(authenticatedUserId, "Java", null, 25L))
                .thenReturn(new SkillDto(skillId, "Java", 25L));

        controller.createForCurrentUser(
                new JwtUserPrincipal(authenticatedUserId, "student@example.com", "STUDENT"),
                new SkillPayload("Java", 25L)
        );

        verify(skillService).createForUser(authenticatedUserId, "Java", null, 25L);
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
