import React, { useEffect, useState } from "react";



// Crear tu primer componente
const Home = () => {
    const [newTarea, setNewTarea] = useState("");
    const [tareas, setTareas] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null); // Para mostrar el botón al pasar el mouse

    const getTodos= async() => {
        try {
            const response = await fetch ('https://playground.4geeks.com/todo/users')
            const data = await response.json()
            setTareas(Array.isArray(data) ? data.map(item => item.label) : [])

    
            
        } catch (error) {
            console.log(error)
            
        }
    }



    function agregarTarea() {
        if (newTarea.trim() === "") return; // Evita agregar tareas vacías
        setTareas([...tareas, newTarea]);
        setNewTarea(""); // Limpiar el input después de agregar
    }

    function eliminarTarea(index) {
        const nuevasTareas = tareas.filter((_, i) => i !== index);
        setTareas(nuevasTareas);
    }

    function eliminarTodas() {
        setTareas([]); // Vacía la lista de tareas
    }

    useEffect(() => {
        getTodos()
    }, [])

    fetch('https://playground.4geeks.com/todo/todos/Victor', {
        method: "POST",
        body: JSON.stringify(todo),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(resp => {
          console.log(resp.ok); // Será true si la respuesta es exitosa
          console.log(resp.status); // El código de estado 201, 300, 400, etc.
          console.log(resp.text()); // Intentará devolver el resultado exacto como string
          return resp.json(); // Intentará parsear el resultado a JSON y retornará una promesa donde puedes usar .then para seguir con la lógica
      })
      .then(data => {
          // Aquí es donde debe comenzar tu código después de que finalice la búsqueda
          console.log(data); // Esto imprimirá en la consola el objeto exacto recibido del servidor
      })
      .catch(error => {
          // Manejo de errores
          console.log(error);
      });

    return (
        <div className="m-auto text-center w-50">
            <input
                type="text"
                value={newTarea}
                onChange={(e) => setNewTarea(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && agregarTarea()} // Agregar tarea al presionar Enter
                placeholder="Escribe tu tarea"
                className="form-control mb-2"
            />
            <button onClick={agregarTarea} className="btn btn-primary">Agregar Tarea</button>

            {/* Boton para consulta tareas de API*/}
            <button onclick={getTodos} className="btn btn-info mb-3 ms-2">Cargar Tareas API</button>

            <h2>{newTarea ? newTarea : ""}</h2>

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
            <p></p>
            <span className="mb-3">Total: {tareas.length}</span>
               
            <button onClick={eliminarTodas} className="btn btn-danger">
               Eliminar todas
            </button>
        </div>
    );
};

export default Home;
