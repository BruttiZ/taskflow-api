package com.todolist.entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Entity;


@Schema(description = "Entidade que representa uma tarefa do sistema")
@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único da tarefa", example = "1")
    private Long id;

    @Schema(description = "Título da tarefa", example = "Estudar Spring Boot")
    private String title;

    @Schema(description = "Descrição detalhada da tarefa", example = "Criar minha primeira API REST")
    private String description;

    @Schema(description = "Status da tarefa", example = "PENDENTE")
    private String status;

    // Construtor padrão exigido pelo JPA
    public Task() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
