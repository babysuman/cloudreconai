package com.cloudrecon.web;

import com.cloudrecon.model.Job;
import com.cloudrecon.service.JobDto;
import com.cloudrecon.service.JobService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api")
public class ApiController {
    public record StartRequest(String imageId) {}
    public record Activity(String day, long images) {}
    public record Stats(long imagesProcessed, long completed, double avgCloudCoverage,
                        double avgReconstruction, JobDto latest, List<Activity> activity) {}

    private final JobService jobs;

    public ApiController(JobService jobs) { this.jobs = jobs; }

    @PostMapping("/images/upload")
    public JobDto upload(@RequestParam("file") MultipartFile file,
                         @RequestParam(value = "composite", defaultValue = "false-color") String composite,
                         @RequestParam(value = "reference", required = false) MultipartFile reference,

// TODO: Complete remaining logic for this module (WIP Week 4)
