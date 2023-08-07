/* eslint-disable testing-library/no-unnecessary-act */
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from './ToDoList';

describe('Todo Component', () => {
  test('should render new todo item', () => {
    // given
    const todosData = [
      {
        text: 'Learn about jest',
        isCompleted: false,
      },
      {
        text: 'Buy a milk',
        isCompleted: false,
      },
    ];
    // when
    render(<TodoList todosData={todosData}></TodoList>);
    // then
    expect(screen.getByText('Learn about jest')).toBeInTheDocument();
  });

  test('should toggle todo item', () => {
    // given
    const todosData = [
      {
        text: 'Learn about jest',
        isCompleted: false,
      },
      {
        text: 'Buy a milk',
        isCompleted: false,
      },
    ];
    // when
    render(<TodoList todosData={todosData}></TodoList>);
    act(() => {
      userEvent.click(screen.getAllByText('🟩')[0]);
    });
    // then
    expect(screen.getByText('Learn about jest')).toHaveClass('completed');
  });

  test('should remove todo item', () => {
    // given
    const todosData = [
      {
        text: 'Learn about jest',
        isCompleted: false,
      },
      {
        text: 'Buy a milk',
        isCompleted: false,
      },
    ];
    // when
    render(<TodoList todosData={todosData}></TodoList>);
    act(() => {
      userEvent.click(screen.getAllByText('❌')[0]);
    });
    // then
    expect(screen.queryByText('Learn about jest')).not.toBeInTheDocument();
  });

  test('should not add new item when empty input', () => {
    // given
    const todosData = [];
    // when
    render(<TodoList todosData={todosData}></TodoList>);
    act(() => {
      userEvent.type(screen.getByPlaceholderText('Add Todo'), '{enter}');
      userEvent.click(screen.getByText('ADD'));
    });
    // then
    expect(screen.queryAllByTestId('todos__item')).toHaveLength(0);
  });

  test('should add new item', () => {
    // given
    const todosData = [];
    // when
    render(<TodoList todosData={todosData}></TodoList>);
    act(() => {
      userEvent.type(screen.getByPlaceholderText('Add Todo'), 'Buy milk');
      userEvent.click(screen.getByText('ADD'));
    });
    // rerender(<TodoList todosData={todosData}></TodoList>);
    // then
    expect(screen.queryAllByTestId('todos__item')).toHaveLength(1);
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });
});
