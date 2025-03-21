import React, { useState } from "react";




//create your first component
const Home = (props) => {
	const [newTarea, setNewTarea] = useState("");
	const [tareas, setTareas] = useState(["hola", "quetal","dimealgo"]);


	return (
		<div className="">
			<input className=""
			type="text"
			onChange={(e) => setNewTarea (e.target.value)}
			value = {newTarea}
			placeholder="escribe tu tarea"
			 />
			<h2 className="">{newTarea ? newTarea : "nuevaTarea"}</h2>
			<ul>
				{tareas.map((tarea, index) => <li key= {index}>{tarea}</li> )}
			</ul>
				

		</div>
	)

}

export default Home;