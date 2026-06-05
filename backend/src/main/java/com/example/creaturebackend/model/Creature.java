package com.example.creaturebackend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "creatures")
public class Creature {
    @Id
    private String id;
    private String name;
    private String type;
    private int level;
    private String rarity;
    @Column(length = 1000)
    private String desc;
    private double baseCaptureChance;

    // store coords and stats as JSON string for simplicity
    @Lob
    private String metaJson;

    public Creature() {}

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }
    public String getRarity() { return rarity; }
    public void setRarity(String rarity) { this.rarity = rarity; }
    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }
    public double getBaseCaptureChance() { return baseCaptureChance; }
    public void setBaseCaptureChance(double baseCaptureChance) { this.baseCaptureChance = baseCaptureChance; }
    public String getMetaJson() { return metaJson; }
    public void setMetaJson(String metaJson) { this.metaJson = metaJson; }
}
