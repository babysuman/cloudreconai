package com.cloudrecon.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "jobs")
public class Job {
    public enum Status { UPLOADED, QUEUED, PROCESSING, COMPLETED, FAILED }

// TODO: Complete remaining logic for this module (WIP Week 3)
