const { sum, minus } = require('./math');

test('test sum function', () => {
  // given
  const number1 = 1,
    number2 = 2;

  // when
  const result = sum(number1, number2);

  // then
  expect(result).toEqual(3);
});

test('test minus function', () => {
    // given
    const number1 = 1,
    number2 = 2;

  // when
  const result = sum(number1, number2);

  // then
  expect(result).toEqual(3);
  expect(minus(2, 1)).toEqual(1);
  expect(minus(1, 2)).toEqual(-1);
});
