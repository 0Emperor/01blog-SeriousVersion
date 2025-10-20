package com.example.__Blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.__Blog.model.Report;
@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {

}
