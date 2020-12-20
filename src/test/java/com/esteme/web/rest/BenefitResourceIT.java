package com.esteme.web.rest;

import com.esteme.EstemeApp;
import com.esteme.domain.Benefit;
import com.esteme.repository.BenefitRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link BenefitResource} REST controller.
 */
@SpringBootTest(classes = EstemeApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class BenefitResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private BenefitRepository benefitRepository;

    @Mock
    private BenefitRepository benefitRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBenefitMockMvc;

    private Benefit benefit;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Benefit createEntity(EntityManager em) {
        Benefit benefit = new Benefit()
            .name(DEFAULT_NAME);
        return benefit;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Benefit createUpdatedEntity(EntityManager em) {
        Benefit benefit = new Benefit()
            .name(UPDATED_NAME);
        return benefit;
    }

    @BeforeEach
    public void initTest() {
        benefit = createEntity(em);
    }

    @Test
    @Transactional
    public void createBenefit() throws Exception {
        int databaseSizeBeforeCreate = benefitRepository.findAll().size();
        // Create the Benefit
        restBenefitMockMvc.perform(post("/api/benefits")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(benefit)))
            .andExpect(status().isCreated());

        // Validate the Benefit in the database
        List<Benefit> benefitList = benefitRepository.findAll();
        assertThat(benefitList).hasSize(databaseSizeBeforeCreate + 1);
        Benefit testBenefit = benefitList.get(benefitList.size() - 1);
        assertThat(testBenefit.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createBenefitWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = benefitRepository.findAll().size();

        // Create the Benefit with an existing ID
        benefit.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBenefitMockMvc.perform(post("/api/benefits")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(benefit)))
            .andExpect(status().isBadRequest());

        // Validate the Benefit in the database
        List<Benefit> benefitList = benefitRepository.findAll();
        assertThat(benefitList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllBenefits() throws Exception {
        // Initialize the database
        benefitRepository.saveAndFlush(benefit);

        // Get all the benefitList
        restBenefitMockMvc.perform(get("/api/benefits?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(benefit.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllBenefitsWithEagerRelationshipsIsEnabled() throws Exception {
        when(benefitRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBenefitMockMvc.perform(get("/api/benefits?eagerload=true"))
            .andExpect(status().isOk());

        verify(benefitRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllBenefitsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(benefitRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBenefitMockMvc.perform(get("/api/benefits?eagerload=true"))
            .andExpect(status().isOk());

        verify(benefitRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getBenefit() throws Exception {
        // Initialize the database
        benefitRepository.saveAndFlush(benefit);

        // Get the benefit
        restBenefitMockMvc.perform(get("/api/benefits/{id}", benefit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(benefit.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }
    @Test
    @Transactional
    public void getNonExistingBenefit() throws Exception {
        // Get the benefit
        restBenefitMockMvc.perform(get("/api/benefits/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBenefit() throws Exception {
        // Initialize the database
        benefitRepository.saveAndFlush(benefit);

        int databaseSizeBeforeUpdate = benefitRepository.findAll().size();

        // Update the benefit
        Benefit updatedBenefit = benefitRepository.findById(benefit.getId()).get();
        // Disconnect from session so that the updates on updatedBenefit are not directly saved in db
        em.detach(updatedBenefit);
        updatedBenefit
            .name(UPDATED_NAME);

        restBenefitMockMvc.perform(put("/api/benefits")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedBenefit)))
            .andExpect(status().isOk());

        // Validate the Benefit in the database
        List<Benefit> benefitList = benefitRepository.findAll();
        assertThat(benefitList).hasSize(databaseSizeBeforeUpdate);
        Benefit testBenefit = benefitList.get(benefitList.size() - 1);
        assertThat(testBenefit.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingBenefit() throws Exception {
        int databaseSizeBeforeUpdate = benefitRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBenefitMockMvc.perform(put("/api/benefits")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(benefit)))
            .andExpect(status().isBadRequest());

        // Validate the Benefit in the database
        List<Benefit> benefitList = benefitRepository.findAll();
        assertThat(benefitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteBenefit() throws Exception {
        // Initialize the database
        benefitRepository.saveAndFlush(benefit);

        int databaseSizeBeforeDelete = benefitRepository.findAll().size();

        // Delete the benefit
        restBenefitMockMvc.perform(delete("/api/benefits/{id}", benefit.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Benefit> benefitList = benefitRepository.findAll();
        assertThat(benefitList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
