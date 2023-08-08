import './App.css';
import { useState } from 'react';
import ToDoList from './ToDoList';

const todosData = [
  {
    text: 'Learn about jest',
    isCompleted: false,
  },
  {
    text: 'Save the thiswebs post',
    isCompleted: false,
  },
  {
    text: 'Buy a milk',
    isCompleted: false,
  },
]

function App() {

  const [name, setName] = useState('')

  return (
    <div className='App'>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        placeholder='Type your name'
      />
      <p>My name is <span>{name}</span></p>
      {/* <ToDoList todosData={todosData}></ToDoList> */}
    </div>
  );
}

export default App;
