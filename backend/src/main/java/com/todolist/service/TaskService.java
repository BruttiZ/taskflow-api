package com.todolist.service;

import com.todolist.entity.Task;
import com.todolist.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Listar todas as tarefas
    public List<Task> listarTodas() {
        return taskRepository.findAll();
    }

    // Buscar tarefa por ID
    public Task buscarPorId(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));
    }

    // Criar nova tarefa
    public Task salvar(Task task) {
        return taskRepository.save(task);
    }

    // Deletar tarefa
    public void deletar(Long id) {
        taskRepository.deleteById(id);
    }

    public Task atualizar(Long id, Task novaTask) {
        Task taskExistente = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        taskExistente.setTitle(novaTask.getTitle());
        taskExistente.setDescription(novaTask.getDescription());
        taskExistente.setStatus(novaTask.getStatus());

        return taskRepository.save(taskExistente);
    }
    
}
