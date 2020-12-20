package com.esteme.repository;

import com.esteme.domain.Benefit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Benefit entity.
 */
@Repository
public interface BenefitRepository extends JpaRepository<Benefit, Long> {

    @Query(value = "select distinct benefit from Benefit benefit left join fetch benefit.isUsedBies",
        countQuery = "select count(distinct benefit) from Benefit benefit")
    Page<Benefit> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct benefit from Benefit benefit left join fetch benefit.isUsedBies")
    List<Benefit> findAllWithEagerRelationships();

    @Query("select benefit from Benefit benefit left join fetch benefit.isUsedBies where benefit.id =:id")
    Optional<Benefit> findOneWithEagerRelationships(@Param("id") Long id);
}
