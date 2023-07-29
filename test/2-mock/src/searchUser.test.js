import searchUser from './searchUser';
import { getAllUsersName } from './services';

// jest.mock('./services.js', () => ({
//   getAllUsersName: jest.fn(() => ['John', 'James', 'Rose', 'Tom', 'David'])
// }))

jest.mock('./services.js', () => ({
  getAllUsersName: jest.fn()
}))

test('should return empty result when not search', () => {
  const keyword = '';
  getAllUsersName.mockImplementation(() => []);

  const result = searchUser(keyword);

  expect(result).toEqual([]);
});

test('should return target results when found search', () => {
  const keyword = 'James';
  getAllUsersName.mockImplementation(() => ['John', 'James', 'Rose', 'Tom', 'David']);

  const result = searchUser(keyword);

  expect(result).toEqual(['James']);
});

test('should not return more than 3 results', () => {
  const keyword = 'James';
  getAllUsersName.mockImplementation(() => [
    'James 1',
    'James 2',
    'James 3',
    'James 4',
    'James 5',
    'Rose', 
    'Tom', 
    'David'
  ]);

  const result = searchUser(keyword);

  expect(result).toHaveLength(3);
});


test('should handle null or undefined as input', () => {
  getAllUsersName.mockImplementation(() => []);

  expect(searchUser(undefined)).toEqual([]);
  expect(searchUser(null)).toEqual([]);
})


test('should return case sensitive', () => {
  
  const keyword = 'john';
  getAllUsersName.mockImplementation(() => ['John', 'James', 'Rose']);

  const result = searchUser(keyword);

  expect(result).toEqual([])
})