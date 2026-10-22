package com.example.backend.repository;

import com.example.backend.entity.Issue;
import com.example.backend.enums.DocumentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    Optional<Issue> findByIssueNo(String issueNo);

    boolean existsByIssueNo(String issueNo);

    @Query("""
            SELECT i FROM Issue i
            WHERE (:status IS NULL OR i.status = :status)
              AND (:fromDate IS NULL OR i.issueDate >= :fromDate)
              AND (:toDate IS NULL OR i.issueDate <= :toDate)
            """)
    Page<Issue> search(@Param("status") DocumentStatus status,
                       @Param("fromDate") LocalDate fromDate,
                       @Param("toDate") LocalDate toDate,
                       Pageable pageable);

    long countByStatus(DocumentStatus status);
}
