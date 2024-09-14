import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { FaEdit } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, settodo] = useState("");
  const [todos, settodos] = useState([]);
  const [showFinished, setshowFinished] = useState(false);

  // Load todos from local storage when the component mounts
  useEffect(() => {
    const todosString = localStorage.getItem("todos");
    if (todosString) {
      const todos = JSON.parse(todosString);
      settodos(todos);
    }
  }, []);

  // Save todos to local storage
  const saveTolS = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const toggleFinished = () => {
    setshowFinished(!showFinished);
  };

  // Handle editing a todo
  const handleEdit = (id) => {
    const currentTodo = todos.find(item => item.id === id);
    const newTodo = prompt("Edit todo", currentTodo ? currentTodo.todo : "");
    if (newTodo !== null && newTodo.trim() !== "") {
      const newTodos = todos.map(item =>
        item.id === id ? { ...item, todo: newTodo } : item
      );
      settodos(newTodos);
      saveTolS();
    }
  };

  // Handle deleting a todo
  const handleDelete = (id) => {
    const newTodos = todos.filter(item => item.id !== id);
    settodos(newTodos);
    saveTolS();
  };

  // Handle adding a new todo
  const handleAdd = () => {
    if (todo.trim() === "") return; // Prevent adding empty todos
    const newTodo = { id: uuidv4(), todo, isCompleted: false };
    const newTodos = [...todos, newTodo];
    settodos(newTodos);
    settodo("");
    saveTolS();
  };

  // Handle input change for new todo
  const handleChange = (e) => {
    settodo(e.target.value);
  };

  // Handle checkbox change for completion status
  const handleCheckbox = (e) => {
    const id = e.target.name;
    const newTodos = todos.map(item =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    settodos(newTodos);
    saveTolS();
  };

  return (
    <>
      <Navbar />
      <div className="  mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-purple-300 min-h-[80vh] md:w-1/2">
        <h1 className="font-bold text-center text-xl">iTask - Manage Your Todos in One Place</h1>
        <div className="addtodo my-5 flex flex-col gap-4">
          <h2 className="text-lg font-bold">Add Todo</h2>
          <input
            onChange={handleChange}
            value={todo}
            type="text"
            className="w-full rounded-full px-5 py-1"
            placeholder="Enter a new todo"
          />
          <button
            onClick={handleAdd} 
            disabled={todo.length <= 3}
            className="bg-purple-800 hover:bg-indigo-950 disabled:bg-indigo-400 p-2 py-1 text-sm font-bold text-white rounded-md"
          >
            Add
          </button>
        </div>
        <div className="flex items-center mb-4">
          <input
          ckassName="my-4" 

            onChange={toggleFinished} 
            type="checkbox" 
            checked={showFinished}
            id="showFinished"
          /> 
          <label htmlFor="showFinished" className="ml-2">Show Finished</label>
        </div>

        <h2 className="text-lg font-bold">Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className="m-5">No Todos To Display</div>}
          {todos.map(item => (
            (showFinished || !item.isCompleted) && (
              <div key={item.id} className="todo flex w-full justify-between items-center mb-2 p-2 bg-white rounded-lg shadow-md">
                <div className="flex gap-5 items-center">
                  <input
                    name={item.id}
                    onChange={handleCheckbox}
                    type="checkbox"
                    checked={item.isCompleted}
                    aria-label={`Mark todo "${item.todo}" as ${item.isCompleted ? 'incomplete' : 'completed'}`}
                  />
                  <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
                </div>

                <div className="buttons flex gap-2">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="bg-purple-800 hover:bg-indigo-950 p-2 text-sm font-bold text-white rounded-md flex items-center"
                    aria-label="Edit todo"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-purple-800 hover:bg-indigo-950 p-2 text-sm font-bold text-white rounded-md flex items-center"
                    aria-label="Delete todo"
                  >
                    <AiFillDelete />
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
