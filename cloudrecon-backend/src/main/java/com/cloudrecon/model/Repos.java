package com.cloudrecon.model;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public final class Repos {
    private Repos() {}

    public interface UserRepository extends JpaRepository<AppUser, Long> {

// TODO: Complete remaining logic for this module (WIP Week 6)
