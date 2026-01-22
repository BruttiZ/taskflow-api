$("#btn").click(function () {
    $.ajax({
        url: "http://localhost:8080/tarefas",
        method: "GET",
        success: function (dados) {
            $("#lista").empty();
            dados.forEach(t => {
                $("#lista").append(`<li>${t.titulo}</li>`);
            });
        },
        error: function () {
            alert("Erro ao buscar tarefas");
        }
    });
});
