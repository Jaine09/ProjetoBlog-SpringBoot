package com.example.demo;

import jakarta.validation.Valid; // OBRIGATÓRIO PARA VALIDAÇÃO
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
    // O @Valid verifica as anotações @NotBlank e @Size na classe Blog
    public ResponseEntity<?> create(@Valid @RequestBody Blog data) {
        try {
            Blog criado = service.adicionarNovo(data);
            return ResponseEntity.status(HttpStatus.CREATED).body(criado);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("error", "Erro ao salvar no banco."));
        }
    }
}