import React, { useEffect, useState } from "react";

const Home = () => {
    const [newTodo, setNewTodo] = useState("");
    const [tareas, setTareas] = useState([]);
    const [usuarios, setUsuarios] = useState([]); // Estado para almacenar usuarios
    const [hoverIndex, setHoverIndex] = useState(null);
    const [message, setMessage] = useState("");
    const apiUrl = "https://playground.4geeks.com/todo";
    const userUrl = `${apiUrl}/users/Victor`;

    // Función para verificar si el usuario existe
    async function checkUserExists() {
        try {
            let response = await fetch(userUrl);
            if (!response.ok) {
                let dataJson = await response.json();
                return dataJson.detail !== "User Victor doesn't exist."; // Devuelve true si el usuario existe
            }
            return true;
        } catch (error) {
            console.error("Error verificando usuario", error);
            return false;
        }
    }

    // Función para crear el usuario si no existe
    async function createUser() {
        try {
            let response = await fetch(userUrl, { method: "POST" });
            return response.ok;
        } catch (error) {
            console.error("Error creando usuario", error);
            return false;
        }
    }

    // Función para cargar las tareas del usuario
    async function loadTodos() {
        try {
            let response = await fetch(userUrl);
            if (!response.ok) {
                setMessage(`Error ${response.status}: ${response.statusText}`);
                setTimeout(() => setMessage(""), 5000);
                return;
            }
            let dataJson = await response.json();
            setTareas(dataJson.todos || []);
        } catch (error) {
            console.error("Error cargando tareas", error);
            setMessage("Hubo un problema al cargar las tareas.");
            setTimeout(() => setMessage(""), 5000);
        }
    }

    // Función para cargar la lista de usuarios
    async function loadUsuarios() {
        try {
            let response = await fetch(apiUrl + "/users");
            if (!response.ok) {
                setMessage(`Error ${response.status}: ${response.statusText}`);
                setTimeout(() => setMessage(""), 5000);
                return;
            }
            let dataJson = await response.json();
            setUsuarios(dataJson.users || []);
        } catch (error) {
            console.error("Error cargando usuarios", error);
            setMessage("Hubo un problema al cargar los usuarios.");
            setTimeout(() => setMessage(""), 5000);
        }
    }

    // Función para vaciar la lista de usuarios
    function desaparecerUsuarios() {
        setUsuarios([]);
    }

    // Función para agregar una nueva tarea
    async function addNewTodo() {
        if (newTodo.trim() === "") return;

        // Si es la primera tarea, verificar si el usuario existe
        if (tareas.length === 0) {
            const userExists = await checkUserExists();
            if (!userExists) {
                const created = await createUser();
                if (!created) {
                    setMessage("No se pudo crear el usuario.");
                    setTimeout(() => setMessage(""), 5000);
                    return;
                }
            }
        }

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

        let dataJson = await response.json();
        if (!dataJson.label) return;

        setTareas([...tareas, dataJson]);
        setNewTodo("");
    }

    // Función para eliminar una tarea
    async function deleteTodo(index) {
        setTareas(tareas.filter((_, i) => i !== index));
    }

    // Función para borrar el usuario "Victor" con confirmación
    async function deleteUser() {
        const confirmDelete = window.confirm("⚠️ ¿Estás seguro de que quieres eliminar el usuario Victor? Esta acción no se puede deshacer.");
        if (!confirmDelete) return;

        let response = await fetch(userUrl, {
            method: "DELETE",
        });

        if (!response.ok) {
            setMessage(`Error ${response.status}: ${response.statusText}`);
            setTimeout(() => setMessage(""), 5000);
            return;
        }

        setTareas([]); // Vaciar la lista de tareas tras la eliminación
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
            <div className="d-flex align-items-center my-2">

                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addNewTodo()}
                    placeholder="Escribe una nueva tarea"
                    className="form-control my-2"
                
                />
                <button onClick={addNewTodo} className="btn btn-primary me-2">Añadir</button>
                </div>
            <div className="">
            <button onClick={loadTodos} className="btn btn-info me-2">Cargar API</button>
            <button onClick={deleteUser} className="btn btn-danger">Eliminar usuario Victor</button>
            </div>

            <hr />

            <h2>Lista de Usuarios</h2>
            <button onClick={loadUsuarios} className="btn btn-success mb-2">Cargar Usuarios</button>
            <ul className="list-group">
                {usuarios.length === 0 ? (
                    <p className="text-muted">No hay usuarios disponibles.</p>
                ) : (
                    usuarios.map((usuario, index) => (
                        <li key={index} className="list-group-item">
                            {usuario.name}
                        </li>
                    ))
                )}
            </ul>
            <button onClick={desaparecerUsuarios} className="btn btn-dark">Cerrar Usuarios</button>
        </div>
    );
};

export default Home;
