package com.example.creaturebackend.repository;

import com.example.creaturebackend.model.Creature;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreatureRepository extends JpaRepository<Creature, String> {

}
