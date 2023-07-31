# Jest 單元測試模組間的依賴

單元測試可以分為獨立形測試單元和社交形測試單元，這兩者的差別就是測試單元是否有使用到其他模組。

比如我們有搜尋使用者 `searchUser` 的函數，它可能會依賴前端串接後端資料的函數 `getAllUsersName`，如果每個測試我們都要真的串接資料，會浪費很多資源和時間。

而且在測試 `searchUser` 函數時，我們也不希望暴露 `getAllUsersName` 的細節。

所以 jest 提供 mock(模擬) 的方法，讓我們模擬資料或函數，以此來確保每個測試的獨立性。

接下來就讓我們看看以上情況要怎麼用 mock 來解決並寫出測試吧！

## getAllUsersName & searchUser

首先我們先寫出 `getAllUsersName` 和 `searchUser` 函數

我們把 `getAllUsersName` 寫在 service.js 檔案裡面，讓他回傳一個空陣列就好，因為等等我們會用 mock 來模擬資料

```jsx
// ./src/service.js
export function getAllUsersName() {
  return [];
}
```

接著來寫 searchUser

```jsx
// ./src/searchUser.js
import * as services from './services';

const searchUser = (keywords) => {
  if (!keywords) return [];

  const userArr = services.getAllUsersName();

	// 取得指定的 user
  const searchResult = userArr.filter((name) => {
    return name.includes(keywords)
  })

  // 返回前三個結果
  return searchResult.length > 3 
    ? searchResult.slice(0, 3) 
    : searchResult;
};

export default searchUser;
```

## 用 mock 來模擬資料並測試

接著我們新增 `searchUser.test.js` 檔案來做測試，我們在一開始可以用 `jest.mock` 來模擬整個資料

```jsx
// ./src/searchUser.test.js
import searchUser from './searchUser';

jest.mock('./services.js', () => ({
	// jest.fn 用來創建一個虛擬的函數
	getAllUsersName: jest.fn(
		() => ['John', 'James', 'Rose', 'Tom', 'David']
	)
}))
```

在測試中，有時候我們需要測試一個函數是否被正確調用、被調用的次數、以及返回值是否正確等。

而 `jest.fn()` 可以幫助我們創建 mock 函數，進行這些測試。

有了 `mock` 和 `jest.fn()` 後，我們就能用這個模擬的資料來進行測試，比如測試 沒有 `keyword`、以及 `keyword = ‘James’` 時，一樣可以用 give when then 的架構來寫

```jsx
import searchUser from './searchUser';

test('should return empty result when not search', () => {
	// when
  const keyword = '';
	// given
  const result = searchUser(keyword);
	// then
  expect(result).toEqual([]);
});

test('should return target results when found search', () => {
	// when
  const keyword = 'James';
	// given
	const result = searchUser(keyword);
	// then
  expect(result).toEqual(['James']);
});
```

接著執行 `npm test` 進行測試

## **mockImplementation**

有時候我們在不同測試的時候需要模擬不同資料，就無法在一開頭寫死模擬的情況，這時候就可以使用 **`mockImplementation`** 函數，在每個測試單元內模擬不圖的情況

我們先把原本 `mock` 函數改寫一下，讓他不要有任何動作，並引入 `getAllUsersName`

```jsx
// ./src.searchUser.test.js
import { getAllUsersName } from './services';

jest.mock('./services.js', () => ({
	// jest.fn 不要有任何行為
  getAllUsersName: jest.fn()
}))

test('should return empty result when not search', () => {
  const keyword = '';
	// 模擬資料 👇
  getAllUsersName.mockImplementation(() => []);
  const result = searchUser(keyword);
  expect(result).toEqual([]);
});

test('should return target results when found search', () => {
  const keyword = 'James';
	// 模擬資料 👇
  getAllUsersName.mockImplementation(() => ['John', 'James', 'Rose', 'Tom', 'David']);
  const result = searchUser(keyword);
  expect(result).toEqual(['James']);
});
```

接著我們可以測試如果超過五個返回的 user 時，是否指返回前三個

```jsx
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
	expect(result[0]).toEqual('James 1');
});
```

## **測試 undefined & null & 大小寫**

接著讓我們繼續完善這個測試，如果傳入 undefined & null 時，要返回空陣列

```jsx
test('should handle null or undefined as input', () => {
  getAllUsersName.mockImplementation(() => []);

  expect(searchUser(undefined)).toEqual([]);
  expect(searchUser(null)).toEqual([]);
})
```

並且我們希望大小寫是敏感的

```jsx
test('should return case sensitive', () => {
  
  const keyword = 'john';
  getAllUsersName.mockImplementation(() => ['John', 'James', 'Rose']);

  const result = searchUser(keyword);

  expect(result).toEqual([])
})
```

到這裡這個函數有很穩健了

## 小結

今天我們一起寫了一個完整的單元測試，並使用到 jest 的 mock 來模擬情況和函數，寫這些測試的好處是

1. 如果以後更改 searchUser 函數時，能夠及時發現錯誤
2. 有其他人要用 searchUser 時，看測試就很清楚這個函數在做些什麼

希望今天有幫助你了解測試到底在幹嘛，明明是很重要的東西，網路上的資訊就比較少一點，很可惜。
