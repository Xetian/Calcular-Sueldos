$(document).ready(function() {
    // Cargar los colaboradores desde localStorage o inicializar un arreglo vacío
    let colaboradores = JSON.parse(localStorage.getItem('colaboradores')) || [];

    // Función para guardar los colaboradores en localStorage
    function guardarEnLocalStorage() {
        localStorage.setItem('colaboradores', JSON.stringify(colaboradores));
    }

    // Función para limpiar mensajes de error
    function limpiarErrores() {
        $("#msg-rut, #msg-nombre, #msg-salario-bruto, #msg-departamento").html("");
    }

    // Función para limpiar el formulario después de enviar
    function limpiarFormulario() {
        $("#txt-rut, #txt-nombre, #select-departamento, #txt-salario-bruto").val("");
    }

    // Función para calcular la retención según el salario bruto
    function obtenerRetencion(salarioBruto) {
        if (salarioBruto > 3000) return 8;
        if (salarioBruto > 1500) return 5;
        return 0;
    }

    // Función para calcular el salario neto después de la retención
    function obtenerSalario(salarioBruto, retencion) {
        return salarioBruto - (salarioBruto * (retencion / 100));
    }

    // Función para asignar colores según el departamento
    function colorDepartamento(departamento) {
        const colores = {
            "Tecnología": "text-bg-primary",
            "Talento Humano": "text-bg-warning",
            "Administración": "text-bg-info"
        };
        return colores[departamento] || "text-bg-dark";
    }

    // Función para asignar colores según la retención
    function colorRetencion(retencion) {
        const colores = {
            0: "bg-danger-subtle",
            5: "bg-warning-subtle",
            8: "bg-success-subtle"
        };
        return colores[retencion] || "bg-body-tertiary";
    }

    // Función para listar colaboradores en la tabla
    function listarColaboradores(colaboradores) {
        const tbody = $("#listado tbody");
        tbody.empty(); // Limpia el contenido del tbody

        colaboradores.forEach(colaborador => {
            const colorDep = colorDepartamento(colaborador.departamento);
            const colorRet = colorRetencion(colaborador.retencion);

            const fila = `
                <tr>
                    <td>${colaborador.rut}</td>
                    <td>${colaborador.nombre}</td>
                    <td><span class="badge ${colorDep}">${colaborador.departamento}</span></td>
                    <td class="text-end">${colaborador.salarioBruto}</td>
                    <td class="${colorRet} text-center">${colaborador.retencion}%</td>
                    <td class="text-end">${colaborador.salarioNeto}</td>
                </tr>
            `;
            tbody.append(fila);
        });
    }

    // Manejador del evento de envío del formulario
    $("#formulario").submit(function(evento) {
        evento.preventDefault();
        limpiarErrores();

        const rut = $("#txt-rut").val();
        const nombre = $("#txt-nombre").val();
        const salarioBruto = parseFloat($("#txt-salario-bruto").val());
        const departamento = $("#select-departamento").val();

        if (!rut) {
            $("#msg-rut").html("Ingrese el RUT");
            return;
        }
        if (!nombre) {
            $("#msg-nombre").html("Ingrese el nombre");
            return;
        }
        if (!salarioBruto) {
            $("#msg-salario-bruto").html("Ingrese el salario bruto");
            return;
        }
        if (!departamento) {
            $("#msg-departamento").html("Seleccione el departamento");
            return;
        }

        const retencion = obtenerRetencion(salarioBruto);
        const salarioNeto = obtenerSalario(salarioBruto, retencion);

        const colaborador = {
            rut,
            nombre,
            salarioBruto,
            departamento,
            retencion,
            salarioNeto
        };

        colaboradores.push(colaborador);
        guardarEnLocalStorage();
        limpiarFormulario();
        listarColaboradores(colaboradores);
    });

    // Manejador para eliminar el último colaborador
    $("#eliminar-ultimo").click(function() {
        if (colaboradores.length === 0) {
            alert("No es posible eliminar, ya que no hay colaboradores registrados");
            return;
        }
        const eliminado = colaboradores.pop();
        guardarEnLocalStorage();
        alert(`Ha eliminado el colaborador ${eliminado.nombre}`);
        listarColaboradores(colaboradores);
    });

    // Manejador para eliminar el primer colaborador
    $("#eliminar-primero").click(function() {
        if (colaboradores.length === 0) {
            alert("No es posible eliminar, ya que no hay colaboradores registrados");
            return;
        }
        const eliminado = colaboradores.shift();
        guardarEnLocalStorage();
        alert(`Ha eliminado el colaborador ${eliminado.nombre}`);
        listarColaboradores(colaboradores);
    });

    // Manejador del evento de búsqueda en tiempo real
    $("#txt-busqueda").keyup(function() {
        const busqueda = $("#txt-busqueda").val().toLowerCase();
        const filtrados = colaboradores.filter(item =>
            item.nombre.toLowerCase().includes(busqueda) ||
            item.rut.includes(busqueda) ||
            item.departamento.toLowerCase().includes(busqueda)
        );
        listarColaboradores(filtrados);
    });

    // Al cargar la página, listar los colaboradores desde localStorage
    listarColaboradores(colaboradores);
});
