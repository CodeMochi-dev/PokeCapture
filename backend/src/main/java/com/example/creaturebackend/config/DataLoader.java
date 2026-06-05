package com.example.creaturebackend.config;

import com.example.creaturebackend.model.Creature;
import com.example.creaturebackend.repository.CreatureRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final CreatureRepository repo;
    private final ObjectMapper mapper = new ObjectMapper();

    public DataLoader(CreatureRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) throws Exception {
        if (repo.count() > 0) return;
        try (InputStream is = new ClassPathResource("creatures.json").getInputStream()){
            List<Map<String,Object>> list = mapper.readValue(is, new TypeReference<>(){});
            for (Map<String,Object> m : list){
                Creature c = new Creature();
                c.setId((String)m.get("id"));
                c.setName((String)m.get("name"));
                c.setType((String)m.get("type"));
                c.setLevel((Integer)m.getOrDefault("level",0));
                c.setRarity((String)m.get("rarity"));
                c.setDesc((String)m.get("desc"));
                Object base = m.get("baseCaptureChance");
                c.setBaseCaptureChance(base instanceof Number ? ((Number)base).doubleValue() : 0.5);
                c.setMetaJson(mapper.writeValueAsString(m.get("stats")));
                repo.save(c);
            }
        }
    }
}
