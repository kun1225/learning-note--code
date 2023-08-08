import { useState } from 'react';
import './ToDoList.css';

export default function ToDoList({todosData}) {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(todosData);

  const addTodo = (text) => {
    if (!text) return;
    const newTodos = [...todos, { text, isCompleted: false }];
    setTodos(newTodos);
    setText('');
  };

  const toggleTodo = (index) => {
    const newTodos = todos.map((todo, i) =>
      i === index ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(newTodos);
  };

  const removeTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return (
    <div className="todos">
      {todos.map(({text, isCompleted}, i) => (
        <div className="todos__item" data-testid="todos__item" key={text}>
          <p className={`${isCompleted ? 'completed' : ''} todos__item-text`} >{text}</p>
          <div>
            <button
              type="button"
              className="todos__item-btn"
              onClick={() => toggleTodo(i)}
            >
              {isCompleted ? '✅' : '🟩'}
            </button>
            <button
              type="button"
              className="todos__item-btn"
              onClick={() => removeTodo(i)}
            >
              ❌
            </button>
          </div>
        </div>
      ))}
      <input
        type="text"
        placeholder="Add Todo"
        className='todos__input'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="button" className='todos__btn' onClick={() => addTodo(text)}>
        ADD
      </button>
    </div>
  );
}
