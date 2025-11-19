package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private BlogRepository repository; // Injeta o repositório

    // Removemos o construtor com dados hardcoded (fixos),
    // pois agora os dados virão do banco de dados real.

    public List<Blog> findAll(){
        return repository.findAll(); // Busca tudo no banco H2
    }

    public Blog adicionarNovo(Blog data) {
        LocalDate hoje = LocalDate.now();
        if(data.getDataPubli().isBefore(hoje)) {
            throw new IllegalArgumentException("A data de publicação deve ser hoje ou no futuro.");
        }

        // Prepara o objeto (o .trim() é uma boa prática manter)
        data.setTitulo(data.getTitulo().trim());
        data.setAutor(data.getAutor().trim());
        data.setTexto(data.getTexto().trim());

        return repository.save(data); // Salva no banco e retorna o objeto salvo
    }
}