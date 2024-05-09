import { useState } from 'react';
import './ToDoList.css';

export default function ToDoList({todosData}) {
  // ...
  return (
    <div className="todos">
      {todos.map(({text, isCompleted}, i) => (
        <div className="todos__item" data-testid="todos__item" key={text}>
          <p className={`${isCompleted && 'completed'} todos__item-text`}>
            {text}
          </p>
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
      <button 
        type="button" 
        className='todos__btn' 
        onClick={() => addTodo(text)}>
        ADD
      </button>
    </div>
  );
}
