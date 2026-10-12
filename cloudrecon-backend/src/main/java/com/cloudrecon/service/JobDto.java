package com.cloudrecon.service;

import com.cloudrecon.model.Job;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/** Matches the frontend SatelliteJob type (status values: Completed, Processing, Queued, Failed). */
public record JobDto(String id, String code, String filename, String status, int stage,
                     double cloudCoverage, double cloudRemoval, double confidence, double reconstructionScore,
                     int width, int height, String engine, String date, String duration, String error,
                     String composite, String report) {

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm", Locale.ENGLISH).withZone(ZoneId.systemDefault());

    public static JobDto from(Job j) {
        String status = switch (j.status) {
            case COMPLETED -> "Completed";
            case PROCESSING -> "Processing";
            case FAILED -> "Failed";
            default -> "Queued";
        };
        return new JobDto(j.id, j.code, j.filename, status, j.stage, j.cloudCoverage, j.cloudRemoval,

// TODO: Complete remaining logic for this module (WIP Week 7)
