package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull; 
import jakarta.validation.constraints.Size;
import lombok.Data; 
import lombok.NoArgsConstructor; 
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "postagens")
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O título é obrigatório")
    @Size(min = 3, max = 100, message = "O título deve ter entre 3 e 100 caracteres")
    private String titulo;

    @NotBlank(message = "O autor é obrigatório")
    @Size(min = 3, max = 100, message = "O autor deve ter entre 3 e 100 caracteres")
    private String autor;

    @NotNull(message = "A data de publicação é obrigatória")
    private LocalDate dataPubli;

    @NotBlank(message = "O texto é obrigatório")
    @Size(min = 10, max = 800, message = "O texto deve ter entre 10 e 800 caracteres")
    @Column(columnDefinition = "TEXT")
    private String texto;
}