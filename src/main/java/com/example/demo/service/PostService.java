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

    public List<Blog> findAll(){
        return repository.findAll();
    }

    public Blog adicionarNovo(Blog data) {

        if(data.getDataPubli().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("A data de publicação não pode ser no passado.");
        }

        data.setTitulo(data.getTitulo().trim());
        data.setAutor(data.getAutor().trim());
        data.setTexto(data.getTexto().trim());

        return repository.save(data); // Salva permanentemente no arquivo do H2
    }

    public Blog atualizar(Long id, Blog dadosAtualizados) {
        // Busca o post no banco pelo ID
        return repository.findById(id).map(postExistente -> {
            // Atualiza os campos com os novos dados vindos do front
            postExistente.setTitulo(dadosAtualizados.getTitulo().trim());
            postExistente.setAutor(dadosAtualizados.getAutor().trim());
            postExistente.setTexto(dadosAtualizados.getTexto().trim());
            postExistente.setDataPubli(dadosAtualizados.getDataPubli());

            // Salva as alterações no banco H2
            return repository.save(postExistente);
        }).orElseThrow(() -> new IllegalArgumentException("Postagem não encontrada com ID: " + id));
    }

    public void excluir(Long id) {
        // Verifica se existe antes de tentar apagar
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            // Opcional: Lança erro se tentar apagar algo que não existe
            throw new IllegalArgumentException("Postagem não encontrada.");
        }
    }


}