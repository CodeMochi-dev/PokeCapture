package com.example.creaturebackend.controller;

import com.example.creaturebackend.model.Creature;
import com.example.creaturebackend.repository.CreatureRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CreatureController {
    
    private final ObjectMapper mapper = new ObjectMapper();
    private final CreatureRepository repo;

    public CreatureController(CreatureRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/creatures")
    public ResponseEntity<List<Map<String,Object>>> listCreatures(){
        List<Creature> all = repo.findAll();
        if (all.isEmpty()){
            // fallback to bundled JSON
            try (InputStream is = new ClassPathResource("creatures.json").getInputStream()){
                List<Map<String,Object>> list = mapper.readValue(is, new TypeReference<>(){});
                return ResponseEntity.ok(list);
            } catch (IOException e){
                return ResponseEntity.internalServerError().build();
            }
        }

        // load bundled JSON once to enrich entities with img/coords when missing
        List<Map<String,Object>> fallback = null;
        try (InputStream is = new ClassPathResource("creatures.json").getInputStream()){
            fallback = mapper.readValue(is, new TypeReference<>(){});
        } catch (IOException ignored) {
            // fallback remains null
        }

        // convert entities to maps, including metaJson as 'stats' when present; merge img/coords from fallback if missing
        List<Map<String,Object>> out = new java.util.ArrayList<>();
        for (Creature c : all) {
            Map<String,Object> m = mapper.convertValue(c, new TypeReference<Map<String,Object>>(){});
            try {
                if (c.getMetaJson() != null && !c.getMetaJson().isEmpty()){
                    Object stats = mapper.readValue(c.getMetaJson(), Object.class);
                    m.put("stats", stats);
                }
            } catch (IOException ignored) {}

            if ((m.get("img") == null || m.get("coords") == null) && fallback != null) {
                for (Map<String,Object> f : fallback){
                    if (f.get("id") != null && f.get("id").equals(c.getId())){
                        if (f.containsKey("img") && m.get("img") == null) m.put("img", f.get("img"));
                        if (f.containsKey("coords") && m.get("coords") == null) m.put("coords", f.get("coords"));
                        break;
                    }
                }
            }

            out.add(m);
        }

        return ResponseEntity.ok(out);
    }

    @GetMapping("/creatures/{id}")
    public ResponseEntity<Creature> getCreature(@PathVariable String id){
        Optional<Creature> c = repo.findById(id);
        return c.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/creatures")
    public ResponseEntity<Creature> createCreature(@RequestBody Creature creature){
        Creature saved = repo.save(creature);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/creatures/{id}")
    public ResponseEntity<Creature> updateCreature(@PathVariable String id, @RequestBody Creature creature){
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        creature.setId(id);
        Creature saved = repo.save(creature);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/creatures/{id}")
    public ResponseEntity<Void> deleteCreature(@PathVariable String id){
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
