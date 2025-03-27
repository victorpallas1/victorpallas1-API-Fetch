import React, { useEffect, useState } from "react";

const Home = () => {
    const [newTodo, setNewTodo] = useState("");
    const [tareas, setTareas] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [message, setMessage] = useState("");
    const apiUrl = "https://playground.4geeks.com/todo";
    const nombreUsuario ="Victor"

    async function loadTodos() {
        try {
            let response = await fetch(apiUrl + "/users/Victor",);
            if (!response.ok) {
                setMessage(`Error ${response.status}: ${response.statusText}`);
                setTimeout(() => setMessage(""), 5000);
                return;
            }
            let dataJson = await response.json();
            setTareas(dataJson.todos || []);
        } catch (error) {
            setMessage("Hubo un problema al cargar las tareas.");
            setTimeout(() => setMessage(""), 5000);
        }
    }


    async function crearUsuario() {
        let response = await fetch(apiUrl + "/users/"+ nombreUsuario , {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({nombreUsuario}),
        });

        if (!response.ok) {
            setMessage(`Error ${response.status}: ${response.statusText}`);
            setTimeout(() => setMessage(""), 5000);
            return;
        }
    }

    async function borrarUsuario() {
        let response = await fetch(apiUrl + "/users/"+ nombreUsuario , {
            method: "DELETE",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({nombreUsuario}),
        });

        if (!response.ok) {
            setMessage(`Error ${response.status}: ${response.statusText}`);
            setTimeout(() => setMessage(""), 5000);
            return;
        }
    }


    async function addNewTodo() {
        if (newTodo.trim() === "") return;

        let response = await fetch(apiUrl + "/todos/Victor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label: newTodo, is_done: false }),
        });

        if (!response.ok) {
            setMessage(`Error ${response.status}: ${response.statusText}`);
            setTimeout(() => setMessage(""), 5000);
            return;
        }

        setTareas([...tareas, { label: newTodo, is_done: false }]);
        setNewTodo("");
    }

    async function deleteTodo(index) {
        setTareas(tareas.filter((_, i) => i !== index));
    }

    useEffect(() => {
        loadTodos();
    }, []);

    return (
        <div className="m-auto text-center w-50">
            {message && <div className="alert alert-danger">{message}</div>}
            <h2>Lista de Tareas</h2>

            <ul className="list-group">
                {tareas.length === 0 ? (
                    <p className="text-muted">No hay tareas disponibles.</p>
                ) : (
                    tareas.map((tarea, index) => (
                        <li
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center"
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                        >
                            {tarea.label}
                            {hoverIndex === index && (
                                <button className="btn btn-danger btn-sm" onClick={() => deleteTodo(index)}>
                                    Eliminar
                                </button>
                            )}
                        </li>
                    ))
                )}
            </ul>

            <p className="mt-2"><strong>Total de tareas:</strong> {tareas.length}</p>

            <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNewTodo()}
                placeholder="Escribe una nueva tarea"
                className="form-control my-2"
            />
            <button onClick={addNewTodo} className="btn btn-primary me-2">Añadir</button>
            <button onClick={loadTodos} className="btn btn-info">Cargar API</button>
            <div className="m-auto text-center w-50">
                <p></p>
                <button onClick={crearUsuario} className="btn btn-primary">Crear lista Victor</button>
                <p></p>
                <button onClick={borrarUsuario} className="btn btn-danger btn-sm">Eliminar lista Victor</button>
            </div>
        </div>
    );
};

export default Home;

