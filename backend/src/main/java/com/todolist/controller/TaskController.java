package com.todolist.controller;

import com.todolist.entity.Task;
import com.todolist.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/tarefas")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TarefaRepository tarefaRepository;

    // Listar todas as tarefas
    @GetMapping
    public List<Task> listarTodas() {
        return tarefaRepository.findAll();
    }

    // Buscar tarefa por ID
    @GetMapping("/{id}")
    public ResponseEntity<Task> buscarPorId(@PathVariable Long id) {
        return tarefaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Criar nova tarefa
    @PostMapping
    public ResponseEntity<Task> criar(@RequestBody Task task) {
        task.setConcluida(false);
        task.setDataCriacao(LocalDateTime.now());
        
        if (task.getPrioridade() == null) {
            task.setPrioridade("MEDIA");
        }
        
        Task novaTarefa = tarefaRepository.save(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaTarefa);
    }

    // Atualizar tarefa
    @PutMapping("/{id}")
    public ResponseEntity<Task> atualizar(@PathVariable Long id, @RequestBody Task taskAtualizada) {
        return tarefaRepository.findById(id)
                .map(task -> {
                    task.setTitulo(taskAtualizada.getTitulo());
                    
                    if (taskAtualizada.getDescricao() != null) {
                        task.setDescricao(taskAtualizada.getDescricao());
                    }
                    
                    if (taskAtualizada.getDataAgendada() != null) {
                        task.setDataAgendada(taskAtualizada.getDataAgendada());
                    }
                    
                    if (taskAtualizada.getPrioridade() != null) {
                        task.setPrioridade(taskAtualizada.getPrioridade());
                    }
                    
                    // Se mudou o status de concluída
                    boolean mudouConclusao = !task.getConcluida().equals(taskAtualizada.getConcluida());
                    task.setConcluida(taskAtualizada.getConcluida());
                    
                    if (mudouConclusao && taskAtualizada.getConcluida()) {
                        task.setDataConclusao(LocalDateTime.now());
                    } else if (mudouConclusao && !taskAtualizada.getConcluida()) {
                        task.setDataConclusao(null);
                    }
                    
                    task.setDataAtualizacao(LocalDateTime.now());
                    Task salva = tarefaRepository.save(task);
                    return ResponseEntity.ok(salva);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Deletar tarefa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (tarefaRepository.existsById(id)) {
            tarefaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}