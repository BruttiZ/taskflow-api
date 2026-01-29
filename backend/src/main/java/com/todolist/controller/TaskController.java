package com.todolist.controller;

import com.todolist.entity.Task;
import com.todolist.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*") // permite o front acessar depois
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<Task> listarTarefas() {
        return taskService.listarTodas();
    }

    @GetMapping("/{id}")
    public Task buscarPorId(@PathVariable Long id) {
        return taskService.buscarPorId(id);
    }

    @PostMapping
    public Task criarTarefa(@RequestBody Task task) {
        return taskService.salvar(task);
    }

    @PutMapping("/{id}")
    public Task atualizarTarefa(@PathVariable Long id, @RequestBody Task taskAtualizada) {
        return taskService.atualizar(id, taskAtualizada);
    }

    @DeleteMapping("/{id}")
    public void deletarTarefa(@PathVariable Long id) {
        taskService.deletar(id);
    }

}
