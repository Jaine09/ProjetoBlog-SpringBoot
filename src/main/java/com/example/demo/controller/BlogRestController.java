package com.example.demo.controller;

import com.example.demo.model.Blog;
import com.example.demo.service.PostService;
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

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Blog data) {
        try {
            // Chama o serviço para atualizar
            Blog atualizado = service.atualizar(id, data);
            return ResponseEntity.ok(atualizado);
        } catch (IllegalArgumentException ex) {
            // Retorna 404 se o ID não existir
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("error", "Erro interno ao atualizar."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.excluir(id);
            // Retorna status 204 (No Content) para dizer que deu certo e não tem corpo de resposta
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        } catch (Exception ex) {
            return ResponseEntity.status(500).build();
        }
    }
}
