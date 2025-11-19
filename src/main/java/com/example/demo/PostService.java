package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private BlogRepository repository;

    public List<Blog> findAll(){
        return repository.findAll();
    }

    public Blog adicionarNovo(Blog data) {
        // Validação de Regra de Negócio (Data)
        if(data.getDataPubli().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("A data de publicação não pode ser no passado.");
        }

        // Limpeza de dados (opcional)
        data.setTitulo(data.getTitulo().trim());

        return repository.save(data); // Salva permanentemente no arquivo do H2
    }
}