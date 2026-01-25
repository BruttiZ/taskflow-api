const API_URL = "http://localhost:8080/tarefas";
let todasTarefas = [];
let filtroAtual = "todas";

// Carregar tarefas ao iniciar
$(document).ready(function() {
    carregarTarefas();
    
    // Limpar data agendada ao clicar no X
    $("#dataAgendada").on("change", function() {
        if (!this.value) {
            $(this).val("");
        }
    });
});

// Mostrar notificação toast
function mostrarToast(mensagem, tipo = 'info') {
    const icones = {
        'success': '✅',
        'error': '❌',
        'info': 'ℹ️',
        'warning': '⚠️',
        'delete': '🗑️',
        'update': '✏️',
        'create': '➕'
    };
    
    const toast = $(`
        <div class="toast toast-${tipo}">
            <span class="toast-icon">${icones[tipo] || icones['info']}</span>
            <span class="toast-message">${mensagem}</span>
        </div>
    `);
    
    $("#toast-container").append(toast);
    
    setTimeout(() => {
        toast.addClass('show');
    }, 100);
    
    setTimeout(() => {
        toast.removeClass('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Carregar todas as tarefas
function carregarTarefas() {
    $.ajax({
        url: API_URL,
        method: "GET",
        success: function(tarefas) {
            todasTarefas = tarefas;
            aplicarFiltro();
        },
        error: function() {
            mostrarToast("Erro ao carregar tarefas", "error");
        }
    });
}

// Aplicar filtro
function aplicarFiltro() {
    let tarefasFiltradas = todasTarefas;
    
    switch(filtroAtual) {
        case 'pendentes':
            tarefasFiltradas = todasTarefas.filter(t => !t.concluida);
            break;
        case 'concluidas':
            tarefasFiltradas = todasTarefas.filter(t => t.concluida);
            break;
        case 'agendadas':
            tarefasFiltradas = todasTarefas.filter(t => t.dataAgendada);
            break;
    }
    
    renderizarTarefas(tarefasFiltradas);
}

// Formatar data
function formatarData(dataString) {
    if (!dataString) return null;
    
    const data = new Date(dataString);
    const agora = new Date();
    const diff = data - agora;
    const diasDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const min = String(data.getMinutes()).padStart(2, '0');
    
    let resultado = `${dia}/${mes}/${ano} às ${hora}:${min}`;
    
    // Indicador de prazo
    if (diff > 0 && diasDiff === 0) {
        resultado += ' <span class="badge badge-hoje">Hoje</span>';
    } else if (diff > 0 && diasDiff === 1) {
        resultado += ' <span class="badge badge-amanha">Amanhã</span>';
    } else if (diff < 0) {
        resultado += ' <span class="badge badge-atrasado">Atrasada</span>';
    }
    
    return resultado;
}

// Renderizar tarefas na lista
function renderizarTarefas(tarefas) {
    $("#lista").empty();
    
    if (tarefas.length === 0) {
        $("#lista").append('<li class="vazio">Nenhuma tarefa para exibir.</li>');
        return;
    }

    // Ordenar por prioridade e data agendada
    tarefas.sort((a, b) => {
        const prioridades = { 'ALTA': 3, 'MEDIA': 2, 'BAIXA': 1 };
        return (prioridades[b.prioridade] || 2) - (prioridades[a.prioridade] || 2);
    });

    tarefas.forEach(tarefa => {
        const prioridadeClass = tarefa.prioridade ? tarefa.prioridade.toLowerCase() : 'media';
        const prioridadeEmoji = {
            'ALTA': '🔴',
            'MEDIA': '🟡',
            'BAIXA': '🟢'
        };
        
        // Informações de data
        let infoData = `<div class="info-datas">`;
        infoData += `<small>📅 Criada: ${formatarData(tarefa.dataCriacao)}</small>`;
        
        if (tarefa.dataAgendada) {
            infoData += `<small>⏰ Agendada: ${formatarData(tarefa.dataAgendada)}</small>`;
        }
        
        if (tarefa.dataAtualizacao) {
            infoData += `<small>✏️ Atualizada: ${formatarData(tarefa.dataAtualizacao)}</small>`;
        }
        
        if (tarefa.dataConclusao) {
            infoData += `<small>✅ Concluída: ${formatarData(tarefa.dataConclusao)}</small>`;
        }
        
        infoData += `</div>`;
        
        const item = `
            <li class="tarefa-item ${tarefa.concluida ? 'concluida' : ''} prioridade-${prioridadeClass}">
                <div class="tarefa-header">
                    <input type="checkbox" 
                           class="checkbox-concluir" 
                           data-id="${tarefa.id}" 
                           ${tarefa.concluida ? 'checked' : ''}>
                    <div class="tarefa-conteudo">
                        <div class="titulo-container">
                            <span class="prioridade-icon">${prioridadeEmoji[tarefa.prioridade] || '🟡'}</span>
                            <span class="titulo">${tarefa.titulo}</span>
                        </div>
                        ${tarefa.descricao ? `<p class="descricao">${tarefa.descricao}</p>` : ''}
                        ${infoData}
                    </div>
                    <div class="acoes">
                        <button class="btn-editar" data-id="${tarefa.id}" title="Editar">✏️</button>
                        <button class="btn-deletar" data-id="${tarefa.id}" title="Deletar">🗑️</button>
                    </div>
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
        mostrarToast("Digite o título da tarefa!", "warning");
        return;
    }

    const novaTarefa = {
        titulo: titulo,
        descricao: $("#descricao").val().trim() || null,
        prioridade: $("#prioridade").val(),
        dataAgendada: $("#dataAgendada").val() ? new Date($("#dataAgendada").val()).toISOString() : null
    };

    $.ajax({
        url: API_URL,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(novaTarefa),
        success: function() {
            $("#novaTarefa").val("");
            $("#descricao").val("");
            $("#dataAgendada").val("");
            $("#prioridade").val("MEDIA");
            carregarTarefas();
            mostrarToast("Tarefa criada com sucesso!", "create");
        },
        error: function() {
            mostrarToast("Erro ao criar tarefa", "error");
        }
    });
});

// Adicionar tarefa ao pressionar Enter
$("#novaTarefa").keypress(function(e) {
    if (e.which === 13) {
        $("#btnAdicionar").click();
    }
});

// Filtros
$(".filtro-btn").click(function() {
    $(".filtro-btn").removeClass("active");
    $(this).addClass("active");
    filtroAtual = $(this).data("filtro");
    aplicarFiltro();
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
                    if (concluida) {
                        mostrarToast("Tarefa concluída! 🎉", "success");
                    } else {
                        mostrarToast("Tarefa reaberta", "info");
                    }
                },
                error: function() {
                    mostrarToast("Erro ao atualizar tarefa", "error");
                }
            });
        }
    });
});

// Editar tarefa
$(document).on("click", ".btn-editar", function() {
    const id = $(this).data("id");

    $.ajax({
        url: `${API_URL}/${id}`,
        method: "GET",
        success: function(tarefa) {
            // Criar modal de edição
            const dataAgendadaFormatada = tarefa.dataAgendada 
                ? new Date(tarefa.dataAgendada).toISOString().slice(0, 16) 
                : '';
            
            const modal = `
                <div class="modal-overlay">
                    <div class="modal">
                        <h2>✏️ Editar Tarefa</h2>
                        <input type="text" id="editTitulo" value="${tarefa.titulo}" placeholder="Título">
                        <textarea id="editDescricao" placeholder="Descrição">${tarefa.descricao || ''}</textarea>
                        
                        <div class="modal-options">
                            <div class="option-group">
                                <label for="editDataAgendada">📅 Agendar para:</label>
                                <input type="datetime-local" id="editDataAgendada" value="${dataAgendadaFormatada}">
                            </div>
                            
                            <div class="option-group">
                                <label for="editPrioridade">⚡ Prioridade:</label>
                                <select id="editPrioridade">
                                    <option value="BAIXA" ${tarefa.prioridade === 'BAIXA' ? 'selected' : ''}>🟢 Baixa</option>
                                    <option value="MEDIA" ${tarefa.prioridade === 'MEDIA' ? 'selected' : ''}>🟡 Média</option>
                                    <option value="ALTA" ${tarefa.prioridade === 'ALTA' ? 'selected' : ''}>🔴 Alta</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="modal-actions">
                            <button class="btn-cancelar">Cancelar</button>
                            <button class="btn-salvar" data-id="${id}">Salvar</button>
                        </div>
                    </div>
                </div>
            `;
            
            $("body").append(modal);
        }
    });
});

// Salvar edição
$(document).on("click", ".btn-salvar", function() {
    const id = $(this).data("id");
    const titulo = $("#editTitulo").val().trim();
    
    if (!titulo) {
        mostrarToast("O título não pode estar vazio!", "warning");
        return;
    }

    $.ajax({
        url: `${API_URL}/${id}`,
        method: "GET",
        success: function(tarefa) {
            tarefa.titulo = titulo;
            tarefa.descricao = $("#editDescricao").val().trim() || null;
            tarefa.prioridade = $("#editPrioridade").val();
            tarefa.dataAgendada = $("#editDataAgendada").val() 
                ? new Date($("#editDataAgendada").val()).toISOString() 
                : null;
            
            $.ajax({
                url: `${API_URL}/${id}`,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(tarefa),
                success: function() {
                    $(".modal-overlay").remove();
                    carregarTarefas();
                    mostrarToast("Tarefa atualizada com sucesso!", "update");
                },
                error: function() {
                    mostrarToast("Erro ao atualizar tarefa", "error");
                }
            });
        }
    });
});

// Cancelar edição
$(document).on("click", ".btn-cancelar, .modal-overlay", function(e) {
    if (e.target === this) {
        $(".modal-overlay").remove();
    }
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
            mostrarToast("Tarefa deletada com sucesso!", "delete");
        },
        error: function() {
            mostrarToast("Erro ao deletar tarefa", "error");
        }
    });
});