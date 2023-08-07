import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('should show full name when type', () => {
  // given
  const name = 'this.web';

  // when
  render(<App />);
  userEvent.type(screen.getByPlaceholderText('Type your name'), name);

  // then
  expect(screen.getByText(name)).toBeInTheDocument();
});
