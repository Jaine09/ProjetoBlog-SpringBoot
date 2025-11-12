// Jaíne Jesus Costa e Camile Vitoria Rosa Santos


package com.example.demo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class Blog {

    @NotBlank @Size(min = 3, max = 100)
    private String titulo;

    @NotBlank @Size(min = 3, max = 100)
    private String autor;

    private LocalDate dataPubli;

    @NotBlank @Size(min = 10, max = 800)
    private String texto;

    public Blog() { }

    public Blog(String autor, String titulo, LocalDate dataPubli, String texto) {
        this.autor = autor;
        this.titulo = titulo;
        this.dataPubli = dataPubli;
        this.texto = texto;
    }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public LocalDate getDataPubli() { return dataPubli; }
    public void setDataPubli(LocalDate dataPubli) { this.dataPubli = dataPubli; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
}
