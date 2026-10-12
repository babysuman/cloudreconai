package com.cloudrecon.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "jobs")
public class Job {
    public enum Status { UPLOADED, QUEUED, PROCESSING, COMPLETED, FAILED }

    @Id public String id;
    public String code;                 // e.g. CR-2026-0004
    public String owner;                // user email

// TODO: Complete remaining logic for this module (WIP Week 4)
