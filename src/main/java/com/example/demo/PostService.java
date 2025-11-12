package com.example.demo;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PostService {
    private Map<String , Blog>mapBlog;

    public PostService() {
        mapBlog = new HashMap<>();
        mapBlog.put("Jaine", new Blog("Jaine", "A cerejeiras rosa", LocalDate.parse("2025-09-30"), "As lindas cerejeiras"));
        mapBlog.put("Camile", new Blog("Camile", "A cerejeiras azul", LocalDate.parse("2025-09-25"), "As lindas cerejeira azuis"));
        mapBlog.put("Giulia", new Blog("Giulia", "A flor cheirosa", LocalDate.parse("2025-09-01"), "As lindas flores"));
        mapBlog.put("Arielly", new Blog("Arielly", "Um dia na praia", LocalDate.parse("2025-09-04"), "Uma linda onda"));

    }

    public List<Blog> findAll(){
        List<Blog> blog = new ArrayList<>(mapBlog.values());
        return blog;
    }

    public Blog adicionarNovo(Blog data) {

        LocalDate hoje = LocalDate.now();
        if(data.getDataPubli().isBefore(hoje)) {
            throw new IllegalArgumentException("A data de publicação deve ser hoje ou no futuro.");
        }

      Blog publi = new Blog(data.getTitulo().trim(), data.getAutor().trim(), data.getDataPubli(), data.getTexto().trim());
        mapBlog.put(publi.getAutor(), publi);
        return publi;
    }


}
