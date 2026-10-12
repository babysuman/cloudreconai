package com.cloudrecon.service;

import com.cloudrecon.model.Job;
import com.cloudrecon.model.Repos.JobRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Year;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class JobService {
    public static final Set<String> KINDS = Set.of("input", "mask", "output");

    private final JobRepository jobs;
    private final CloudEngine engine;
    private final Path dir;
    private final ExecutorService pool = Executors.newFixedThreadPool(2);

    public JobService(JobRepository jobs, CloudEngine engine, @Value("${app.storage-dir}") String storageDir) throws IOException {
        this.jobs = jobs;
        this.engine = engine;

// TODO: Complete remaining logic for this module (WIP Week 3)
