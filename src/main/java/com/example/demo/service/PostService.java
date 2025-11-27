package com.example.demo.service;

import com.example.demo.repository.BlogRepository;
import com.example.demo.model.Blog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;


@Service
public class PostService {

    @Autowired
    private BlogRepository repository;

    public List<Blog> findAll() {
        return repository.findAll();
    }

    public Blog adicionarNovo(Blog data) {
        return repository.save(data);
    }

    public Blog atualizar(Long id, Blog data) {

        Blog existente = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ID não encontrado"));

        existente.setTitulo(data.getTitulo());
        existente.setAutor(data.getAutor());
        existente.setDataPubli(data.getDataPubli());
        existente.setTexto(data.getTexto());

        return repository.save(existente);
    }

    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("ID não encontrado");
        }
        repository.deleteById(id);
    }
}
