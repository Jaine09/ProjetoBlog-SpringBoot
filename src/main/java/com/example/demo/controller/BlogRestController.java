package com.example.demo.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.model.Blog;
import com.example.demo.service.PostService;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/blog")
@CrossOrigin(origins = "*")
public class BlogRestController {
    @Autowired
    private PostService service;

    @GetMapping
    public List<Blog> findAll(){
        return service.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Blog data) {
        if (data.getTitulo() == null || data.getTitulo().trim().length() < 3) {
            return ResponseEntity.badRequest().body(Map.of("error", "O título deve ter no mínimo 3 caracteres"));
        }
        if (data.getAutor() == null || data.getAutor().trim().length() < 3) {
            return ResponseEntity.badRequest().body(Map.of("error", "O autor deve ter no mínimo 3 caracteres"));
        }
        if (data.getTexto() == null || data.getTexto().trim().length() < 10) {
            return ResponseEntity.badRequest().body(Map.of("error", "O texto deve ter no mínimo 10 caracteres"));
        }
        if (data.getDataPubli() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "A data de publicação é obrigatória"));
        }

        try {
            Blog criando = service.adicionarNovo(data);
            return ResponseEntity.ok(criando);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("error", "Erro ao salvar: " + ex.getMessage()));
        }
    }



}
