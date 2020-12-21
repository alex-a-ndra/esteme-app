package com.esteme.web.rest;

import com.esteme.domain.Benefit;
import com.esteme.repository.BenefitRepository;
import com.esteme.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.esteme.domain.Benefit}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BenefitResource {

    private final Logger log = LoggerFactory.getLogger(BenefitResource.class);

    private static final String ENTITY_NAME = "benefit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BenefitRepository benefitRepository;

    public BenefitResource(BenefitRepository benefitRepository) {
        this.benefitRepository = benefitRepository;
    }

    /**
     * {@code POST  /benefits} : Create a new benefit.
     *
     * @param benefit the benefit to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new benefit, or with status {@code 400 (Bad Request)} if the benefit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/benefits")
    public ResponseEntity<Benefit> createBenefit(@RequestBody Benefit benefit) throws URISyntaxException {
        log.debug("REST request to save Benefit : {}", benefit);
        if (benefit.getId() != null) {
            throw new BadRequestAlertException("A new benefit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Benefit result = benefitRepository.save(benefit);
        return ResponseEntity.created(new URI("/api/benefits/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /benefits} : Updates an existing benefit.
     *
     * @param benefit the benefit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated benefit,
     * or with status {@code 400 (Bad Request)} if the benefit is not valid,
     * or with status {@code 500 (Internal Server Error)} if the benefit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/benefits")
    public ResponseEntity<Benefit> updateBenefit(@RequestBody Benefit benefit) throws URISyntaxException {
        log.debug("REST request to update Benefit : {}", benefit);
        if (benefit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Benefit result = benefitRepository.save(benefit);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, benefit.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /benefits} : get all the benefits.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of benefits in body.
     */
    @GetMapping("/benefits")
    public List<Benefit> getAllBenefits(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Benefits");
        return benefitRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /benefits/:id} : get the "id" benefit.
     *
     * @param id the id of the benefit to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the benefit, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/benefits/{id}")
    public ResponseEntity<Benefit> getBenefit(@PathVariable Long id) {
        log.debug("REST request to get Benefit : {}", id);
        Optional<Benefit> benefit = benefitRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(benefit);
    }

    /**
     * {@code DELETE  /benefits/:id} : delete the "id" benefit.
     *
     * @param id the id of the benefit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/benefits/{id}")
    public ResponseEntity<Void> deleteBenefit(@PathVariable Long id) {
        log.debug("REST request to delete Benefit : {}", id);
        benefitRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
