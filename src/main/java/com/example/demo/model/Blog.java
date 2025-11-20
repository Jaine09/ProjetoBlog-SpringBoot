package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull; // Importante para datas
import jakarta.validation.constraints.Size;
import lombok.Data; // Do Lombok
import lombok.NoArgsConstructor; // Do Lombok
import lombok.AllArgsConstructor; // Do Lombok
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
    @Column(columnDefinition = "TEXT") // Permite textos longos
    private String texto;
}