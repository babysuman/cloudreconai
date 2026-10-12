package com.cloudrecon.service;

import org.springframework.beans.factory.annotation.Value;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.http.HttpClient;
import java.util.Base64;
import java.util.function.IntConsumer;

/**
 * Cloud detection and reconstruction.
 * Stage 2: detect bright, low-colour pixels (clouds) and widen the mask.
 * Stage 3: rebuild with the generative AI service if configured, otherwise a diffusion fill in pure Java.
 * Stage 4: compute quality metrics.
 */
@Service
public class CloudEngine {

    public record Result(BufferedImage output, BufferedImage mask, double coverage,
                         double cloudRemoval, double confidence, double score, String engine, String report) {}


// TODO: Complete remaining logic for this module (WIP Week 2)
