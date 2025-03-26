{/* Nombre Home.jsx para probar o boton de consulta a API e devolve todos os usuarios creados, e colocaos como si fosen tareas */}


import React, { useEffect, useState } from "react";

// Crear tu primer componente
const Home = () => {
    const [newTarea, setNewTarea] = useState("");
    const [tareas, setTareas] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null); // Para mostrar el botón al pasar el mouse

    // Función para obtener tareas desde la API
    const getTodos = async () => {
        try {
            const response = await fetch('https://playground.4geeks.com/todo/users');
            const data = await response.json();

            if (data.users && Array.isArray(data.users)) {
                setTareas(data.users.map(user => user.name)); // Extrae los nombres como tareas
            } else {
                console.error("Formato de respuesta incorrecto", data);
            }
        } catch (error) {
            console.error("Error al obtener datos de la API:", error);
        }
    };

    // Función para agregar tarea
    function agregarTarea() {
        if (newTarea.trim() === "") return; // Evita agregar tareas vacías
        setTareas([...tareas, newTarea]);
        setNewTarea(""); // Limpiar el input después de agregar
    }

    // Función para eliminar una tarea individual
    function eliminarTarea(index) {
        const nuevasTareas = tareas.filter((_, i) => i !== index);
        setTareas(nuevasTareas);
    }

    // Función para eliminar todas las tareas
    function eliminarTodas() {
        setTareas([]); // Vacía la lista de tareas
    }

    // Función para enviar datos a la API (POST)
    const postTodo = async () => {
        const todo = { label: newTarea, done: false };

        try {
            const response = await fetch('https://playground.4geeks.com/todo/todos/Victor', {
                method: "POST",
                body: JSON.stringify(todo),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Error en la solicitud");

            const data = await response.json();
            console.log("Tarea agregada a la API:", data);
        } catch (error) {
            console.error("Error al enviar tarea:", error);
        }
    };

    useEffect(() => {
        getTodos();
    }, []);

    return (
        <div className="m-auto text-center w-50">
            <h1>Mis tareas</h1>

            <input
                type="text"
                value={newTarea}
                onChange={(e) => setNewTarea(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && agregarTarea()} // Agregar tarea al presionar Enter
                placeholder="Escribe tu tarea"
                className="form-control mb-2"
            />
            <button onClick={agregarTarea} className="btn btn-primary">Agregar Tarea</button>

            {/* Botón para cargar tareas de la API */}
            <button onClick={getTodos} className="btn btn-info mb-3 ms-2">Cargar Tareas API</button>

            {/* Contador y botón "Eliminar todas" en la misma línea */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Total: {tareas.length}</span>
                <button onClick={eliminarTodas} className="btn btn-danger btn-sm">
                    Eliminar todas
                </button>
            </div>

            <ul className="list-group">
                {tareas.map((tarea, index) => (
                    <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        {tarea}
                        {hoverIndex === index && (
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => eliminarTarea(index)}
                            >
                                DELETE
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
