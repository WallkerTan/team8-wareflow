package com.example.backend.repository;

import com.example.backend.entity.IssueItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueItemRepository extends JpaRepository<IssueItem, Long> {

    List<IssueItem> findByIssueIdOrderById(Long issueId);

    void deleteByIssueId(Long issueId);
}
