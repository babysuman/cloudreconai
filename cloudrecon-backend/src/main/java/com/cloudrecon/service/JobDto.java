package com.cloudrecon.service;

import com.cloudrecon.model.Job;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/** Matches the frontend SatelliteJob type (status values: Completed, Processing, Queued, Failed). */
public record JobDto(String id, String code, String filename, String status, int stage,

// TODO: Complete remaining logic for this module (WIP Week 3)
