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
                         Authentication auth) throws IOException {
        return JobDto.from(jobs.upload(file, auth.getName(), composite, reference));
    }

    @PostMapping("/analysis/start")
    public JobDto start(@RequestBody StartRequest r, Authentication auth) throws IOException {
        return JobDto.from(jobs.start(r.imageId(), auth.getName()));
    }

    @GetMapping("/analysis/{id}")
    public JobDto analysis(@PathVariable String id, Authentication auth) {
        return JobDto.from(jobs.owned(id, auth.getName()));
    }

    @GetMapping("/results/{id}")
    public JobDto result(@PathVariable String id, Authentication auth) {
        return JobDto.from(jobs.owned(id, auth.getName()));
    }

    @GetMapping("/results/{id}/{kind}")
    public ResponseEntity<Resource> image(@PathVariable String id, @PathVariable String kind, Authentication auth) {
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG)
                .body(new FileSystemResource(jobs.imagePath(id, auth.getName(), kind)));
    }

    @GetMapping("/results/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable String id, Authentication auth) {
        Job j = jobs.owned(id, auth.getName());
        String base = j.filename.replaceAll("\\.[^.]+$", "");
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG)

// TODO: Complete remaining logic for this module (WIP Week 7)
