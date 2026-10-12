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

    private final String aiUrl;

    public CloudEngine(@Value("${app.ai-service-url:}") String aiUrl) {
        this.aiUrl = aiUrl == null ? "" : aiUrl.trim();
    }

    public Result process(BufferedImage src, BufferedImage reference, String composite, String filename, IntConsumer stage) throws IOException {
        int w = src.getWidth(), h = src.getHeight();
        BufferedImage rgb = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = rgb.createGraphics();
        g.drawImage(src, 0, 0, null);
        g.dispose();

        stage.accept(2);
        boolean[] raw = detect(rgb, w, h);
        boolean[] cloud = dilate(raw, w, h, 4);
        long rawCount = count(raw), maskCount = count(cloud);
        BufferedImage mask = new BufferedImage(w, h, BufferedImage.TYPE_BYTE_GRAY);
        for (int i = 0; i < cloud.length; i++) mask.getRaster().setSample(i % w, i / w, 0, cloud[i] ? 255 : 0);

        stage.accept(3);
        // Preferred path: the Python AI service does detection, generative reconstruction and the report.
        if (!aiUrl.isEmpty()) {
            try {
                stage.accept(4);
                return remote(rgb, reference, composite, filename);
            } catch (Exception e) {
                System.err.println("AI service failed, using the Java fallback engine: " + e.getMessage());
            }
        }
        BufferedImage out = inpaint(rgb, cloud, w, h);
        String engine = "java-diffusion";

        stage.accept(4);
        long residual = count(detect(out, out.getWidth(), out.getHeight()));
        double coverage = 100.0 * maskCount / cloud.length;
        double removal = rawCount == 0 ? 100 : clamp(100.0 * (1 - (double) residual / rawCount));
        double confidence = clamp(100 - 0.4 * coverage);   // heuristic: less cloud = more known context
        double score = (removal + confidence) / 2;
        return new Result(out, mask, round(coverage), round(removal), round(confidence), round(score), engine, null);
    }

    private static double clamp(double v) { return Math.max(0, Math.min(100, v)); }
    private static double round(double v) { return Math.round(v * 10) / 10.0; }

    private static long count(boolean[] a) { long n = 0; for (boolean b : a) if (b) n++; return n; }

    private boolean[] detect(BufferedImage img, int w, int h) {
        int[] px = img.getRGB(0, 0, w, h, null, 0, w);
        boolean[] m = new boolean[px.length];
        for (int i = 0; i < px.length; i++) {
            int r = (px[i] >> 16) & 255, g = (px[i] >> 8) & 255, b = px[i] & 255;
            int max = Math.max(r, Math.max(g, b)), min = Math.min(r, Math.min(g, b));
            m[i] = min >= 170 && (max - min) <= 45;
        }
        return m;
    }

    private boolean[] dilate(boolean[] m, int w, int h, int r) {
        boolean[] a = new boolean[m.length], b = new boolean[m.length];
        for (int y = 0; y < h; y++)
            for (int x = 0; x < w; x++)
                for (int k = Math.max(0, x - r); k <= Math.min(w - 1, x + r) && !a[y * w + x]; k++)
                    if (m[y * w + k]) a[y * w + x] = true;
        for (int y = 0; y < h; y++)
            for (int x = 0; x < w; x++)
                for (int k = Math.max(0, y - r); k <= Math.min(h - 1, y + r) && !b[y * w + x]; k++)
                    if (a[k * w + x]) b[y * w + x] = true;
        return b;

// TODO: Complete remaining logic for this module (WIP Week 6)
