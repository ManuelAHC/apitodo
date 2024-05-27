const botonAgregar = document.getElementById('boton-agregar');
const listaTareasPendientes = document.getElementById('lista-tareas-pendientes');
const listaTareasCompletadas = document.getElementById('lista-tareas-completadas');
const botonActualizar = document.getElementById('boton-actualizar');
const inputTarea = document.getElementById('input-tarea');

let arregloTareas = [];

const URLs = {
    crearTarea: 'https://claseprogramacion3.000webhostapp.com/apitodo/api/create.php',
    obtenerTareas: 'https://claseprogramacion3.000webhostapp.com/apitodo/api/read.php',
    obtenerTareaPorId: 'https://claseprogramacion3.000webhostapp.com/apitodo/api/read_single.php',
    actualizarTarea: 'https://claseprogramacion3.000webhostapp.com/apitodo/api/update.php',
    eliminarTarea: 'https://claseprogramacion3.000webhostapp.com/apitodo/api/delete.php'
};

async function obtenerTodasLasTareas() {
    try {
        const response = await fetch(URLs.obtenerTareas);
        const data = await response.json();
        arregloTareas = data.records || [];
        renderizarTareas();
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
    }
}

async function agregarTareaAPI(tarea) {
    try {
        const response = await fetch(URLs.crearTarea, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarea)
        });
        const data = await response.json();
        return data;
        renderizarTareas();
    } catch (error) {
        console.error('Error al crear tarea:', error);
    }
}

async function agregarTarea(texto, descripcion) { 
    const nuevaTarea = { title: texto, description: descripcion, status: 'pending' };
    try {
        const response = await fetch(URLs.crearTarea, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTarea)
        });
        const data = await response.json();
        if (response.ok && data.id) {
            nuevaTarea.id = data.id;
            arregloTareas.push(nuevaTarea);
            renderizarTareas();
        } else {
            console.error('Error al agregar tarea:', data.message || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error al agregar tarea:', error);
    }
}

async function eliminarTareaAPI(id) {
    try {
        const response = await fetch(URLs.eliminarTarea, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
    }
}

async function actualizarTareaAPI(tarea) {
    try {
        const response = await fetch(URLs.actualizarTarea, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarea)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
    }
}

function renderizarTareas() {
    listaTareasPendientes.innerHTML = '';
    listaTareasCompletadas.innerHTML = '';

    arregloTareas.forEach((tarea) => {
        const tareaElemento = document.createElement('li');
        tareaElemento.innerHTML = `
            <input type="text" class="input-tarea" value="${tarea.title}" data-id="${tarea.id}">
            <button class="boton-eliminar" data-id="${tarea.id}">X</button>
        `;
        tareaElemento.querySelector('.input-tarea').addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const id = parseInt(event.target.getAttribute('data-id'));
                const tareaActualizada = arregloTareas.find(tarea => tarea.id === id);
                tareaActualizada.title = event.target.value;
                actualizarTareaAPI(tareaActualizada).then(() => {
                    renderizarTareaIndividual(tareaActualizada);
                });
            }
        });

        if (tarea.status === 'completed') {
            tareaElemento.style.textDecoration = 'line-through';
            listaTareasCompletadas.appendChild(tareaElemento);
        } else {
            const completarButton = document.createElement('button');
            completarButton.textContent = 'Completar';
            completarButton.setAttribute('data-id', tarea.id);
            completarButton.classList.add('boton-completar');
            completarButton.addEventListener('click', (event) => {
                const id = parseInt(event.target.getAttribute('data-id'));
                actualizarEstadoTarea(id, 'completed');
            });
            tareaElemento.appendChild(completarButton);
            listaTareasPendientes.appendChild(tareaElemento);
        }
    });
}

function renderizarTareaIndividual(tarea) {
    const tareaElemento = document.querySelector(`[data-id="${tarea.id}"]`).parentElement;
    
    tareaElemento.querySelector('.input-tarea').value = tarea.title;
    tareaElemento.querySelector('.boton-completar').textContent = tarea.status === 'completed' ? 'Reabrir' : 'Completar';
    
    if (tarea.status === 'completed') {
        tareaElemento.style.textDecoration = 'line-through';
        listaTareasCompletadas.appendChild(tareaElemento);
    } else {
        tareaElemento.style.textDecoration = 'none';
        listaTareasPendientes.appendChild(tareaElemento);
    }
}

async function agregarTarea(texto) {
    const nuevaTarea = { title: texto, description: '', status: 'pending' };
    try {
        const response = await fetch(URLs.crearTarea, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTarea)
        });
        const data = await response.json();
        if (response.ok && data.id) {
            nuevaTarea.id = data.id;
            arregloTareas.push(nuevaTarea);
            renderizarTareas();
        } else {
            console.error('Error al agregar tarea:', data.message || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error al agregar tarea:', error);
    }
}

function eliminarTarea(id) {
    arregloTareas = arregloTareas.filter(tarea => tarea.id !== id);
    renderizarTareas();
    eliminarTareaAPI(id); 
}

async function actualizarEstadoTarea(id, nuevoEstado) {
    const tarea = arregloTareas.find(tarea => tarea.id === id);
    if (tarea) {
        tarea.status = nuevoEstado; 
        try {
            await actualizarTareaAPI({ id, status: nuevoEstado });
            renderizarTareaIndividual(tarea);
        } catch (error) {
            console.error('Error al actualizar el estado de la tarea:', error);
        }
    }
}

botonAgregar.addEventListener('click', () => {
    const nuevaTareaTexto = inputTarea.value.trim();
    if (nuevaTareaTexto) {
        agregarTarea(nuevaTareaTexto);
        inputTarea.value = '';
    }
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('boton-eliminar')) {
        const id = parseInt(event.target.getAttribute('data-id'));
        eliminarTarea(id);
    }
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('boton-completar')) {
        const id = parseInt(event.target.getAttribute('data-id'));
        const tarea = arregloTareas.find(tarea => tarea.id === id);
        if (tarea && tarea.status === 'pending') {
            tarea.status = 'completed';
            actualizarEstadoTarea(id, 'completed');
        }
    }
});

botonActualizar.addEventListener('click', () => { 
    obtenerTodasLasTareas();
});

document.addEventListener('keypress', (event) => {if (event.key === 'Enter' && event.target.classList.contains('input-tarea')) {
    const id = parseInt(event.target.getAttribute('data-id'));
    const tarea = arregloTareas.find(tarea => tarea.id === id);
    if (tarea) {
        tarea.title = event.target.value;
        actualizarTareaAPI(tarea).then(() => {
            renderizarTareaIndividual(tarea);
        });
    }
}
});

window.addEventListener('load', obtenerTodasLasTareas);