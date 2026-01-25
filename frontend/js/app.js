const API_URL = "http://localhost:8080/tarefas";

// Carregar tarefas ao iniciar
$(document).ready(function() {
    carregarTarefas();
});

// Carregar todas as tarefas
function carregarTarefas() {
    $.ajax({
        url: API_URL,
        method: "GET",
        success: function(tarefas) {
            renderizarTarefas(tarefas);
        },
        error: function() {
            alert("Erro ao carregar tarefas");
        }
    });
}

// Renderizar tarefas na lista
function renderizarTarefas(tarefas) {
    $("#lista").empty();
    
    if (tarefas.length === 0) {
        $("#lista").append('<li class="vazio">Nenhuma tarefa ainda. Adicione uma!</li>');
        return;
    }

    tarefas.forEach(tarefa => {
        const item = `
            <li class="tarefa-item ${tarefa.concluida ? 'concluida' : ''}">
                <input type="checkbox" 
                       class="checkbox-concluir" 
                       data-id="${tarefa.id}" 
                       ${tarefa.concluida ? 'checked' : ''}>
                <span class="titulo">${tarefa.titulo}</span>
                <div class="acoes">
                    <button class="btn-editar" data-id="${tarefa.id}">✏️</button>
                    <button class="btn-deletar" data-id="${tarefa.id}">🗑️</button>
                </div>
            </li>
        `;
        $("#lista").append(item);
    });
}

// Adicionar nova tarefa
$("#btnAdicionar").click(function() {
    const titulo = $("#novaTarefa").val().trim();
    
    if (!titulo) {
        alert("Digite o título da tarefa!");
        return;
    }

    $.ajax({
        url: API_URL,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ titulo: titulo }),
        success: function() {
            $("#novaTarefa").val("");
            carregarTarefas();
        },
        error: function() {
            alert("Erro ao criar tarefa");
        }
    });
});

// Adicionar tarefa ao pressionar Enter
$("#novaTarefa").keypress(function(e) {
    if (e.which === 13) {
        $("#btnAdicionar").click();
    }
});

// Marcar tarefa como concluída/não concluída
$(document).on("change", ".checkbox-concluir", function() {
    const id = $(this).data("id");
    const concluida = $(this).is(":checked");

    $.ajax({
        url: `${API_URL}/${id}`,
        method: "GET",
        success: function(tarefa) {
            tarefa.concluida = concluida;
            
            $.ajax({
                url: `${API_URL}/${id}`,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(tarefa),
                success: function() {
                    carregarTarefas();
                },
                error: function() {
                    alert("Erro ao atualizar tarefa");
                }
            });
        }
    });
});

// Editar tarefa
$(document).on("click", ".btn-editar", function() {
    const id = $(this).data("id");
    const novoTitulo = prompt("Digite o novo título:");

    if (!novoTitulo || !novoTitulo.trim()) {
        return;
    }

    $.ajax({
        url: `${API_URL}/${id}`,
        method: "GET",
        success: function(tarefa) {
            tarefa.titulo = novoTitulo.trim();
            
            $.ajax({
                url: `${API_URL}/${id}`,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(tarefa),
                success: function() {
                    carregarTarefas();
                },
                error: function() {
                    alert("Erro ao editar tarefa");
                }
            });
        }
    });
});

// Deletar tarefa
$(document).on("click", ".btn-deletar", function() {
    const id = $(this).data("id");
    
    if (!confirm("Tem certeza que deseja deletar esta tarefa?")) {
        return;
    }

    $.ajax({
        url: `${API_URL}/${id}`,
        method: "DELETE",
        success: function() {
            carregarTarefas();
        },
        error: function() {
            alert("Erro ao deletar tarefa");
        }
    });
});