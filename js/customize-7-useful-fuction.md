# 自己動手寫 7 個好用的 JS 函數

## 1. console.log()
相信大家寫 JS 時很常使用 console.log() 來檢查自己寫的程式，我們可以利用解構附值，將 `console` 物件中的 `log` 解構出來並咐值給 `log` 變量，以此來更簡短的使用

```jsx
const {log} = console;

log('Hello World!');

console.log('Hello World');
```

但是在團隊開發中，為了統一程式碼風格和提高可讀性，要在專案中規定使用一種風格，比如統一使用 `console.log` 或者解構賦值的方式來使用 `log`，而不是兩種方式混用會比較好。


## 2. randomInt()
Math.random() 可以隨機產生 0 ~ 1 的數字（包含 0，不包含 1），如果我們想要獲得 0 ~ 10 的數字就必須要 Math.random() * 10 來使用，所以我們可以把 Math.random() 封裝起來讓他更易使用

```jsx
const randomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

randomInt (13, 30) // 13 ~ 30
```
`max - min + 1` 要 +1 是因為 Math.random() 返回的數字不包含 1，假設我們希望他返回的 0 ~ 3，若不 +1，則只會返回 0 ~ 2.xxx，這樣最後使用 Math.floor() 就無法獲得 3 了。

若希望傳入浮點數和 n 位數，並隨機回傳介於兩者之間的 n 位浮點數，可以這樣來更改:

```js
const randomFloat = (min, max, n) => {
  const range = max - min;
  const randomValue = Math.random() * range + min;
  const factor = Math.pow(10, n);
  return Math.round(randomValue * factor) / factor;
}

console.log(randomFloat(1.2, 4.5, 2));
 // 可能的結果是 2.36、3.81、1.93 等等
```
`Math.pow()` 是次方的意思。

## 3. setTimes()
如果我們想要每隔一段時間執行指定的函數，可以使用 setInterval()，但如果我們希望執行指定的次數，JS 就沒有提共相對的 API，不過我們仍然可以這樣封裝

```jsx
const setTimes = (func, n) => {
	Array.from(Array(n)).forEach(() => {
		func();
	})
}

setTimes(() => {
  console.log('hello')
}, 3)
// hello
// hello
// hello
```

解釋：  
- Array(n) - 創造長度為 n 的陣列

```jsx
Array(5) // [,,,,]
```

- Array.from() - 淺複製一個陣列

```jsx
Array.from(Array(5)) // [undefined, undefined, ...] 
```

後來我想到一個語意更好懂的寫法  
```js
Array(n).fill(null).forEach(() => {
    func();
  })
```
加上為了避免第一個參數不是函數，我們可以加入類型檢查，優化成下面這樣    

```js
const setTimes = (func, n) => {
	if (typeof func !== 'function') {
		throw new Error('The first argument must be a function!');
	}
  Array(n).fill(null).forEach(() => {
    func();
  })
}
```


## 4. slugify()

如果我們想把字串轉換成 url 網址的形式，  
例如把字母轉成小寫、刪除特殊字元或空格，並以破折號取代空格等，  
`JS Utility Functions => js-utility-functions`   
，可以這樣來寫函數:    

```jsx
const slugify = (string, separator = "-") => {
  return string
    .toString() // Cast to string (optional)
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, separator) // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\_/g, separator) // Replace _ with -
    .replace(/\-\-+/g, separator) // Replace multiple - with single -
    .replace(/\-$/g, ""); // Remove trailing -
};

slugify("Hello, World!");
// Expected output: "hello-world"

slugify("Hello, Universe!", "_");
// Expected output: "hello_universe"
```

separator 可以自己放想要替換的符號，預設是 `-`  

* `replace(/\s+/g, separator)`: 
  * `\s` 表空格，
  * `+` 表可以出現一次以上
* `replace(/[^\w\-]+/g, "")`: 
  * `[]` 表集合
  * `^` 表不是
  * `\w` 表示字母
  * `\-` 表示破折號
* `replace(/\-$/g, "")`: 
  * `$` 表結尾



## 5. validateEmail()
有時候我們需要驗證表單 email，我們也可以用 regex 來驗證
```jsx
const validateEmail = (email) => {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
};

validateEmail("youremail@gmail.com"); // true
validateEmail("youremail@com"); // false
validateEmail("youremail.gmail@com"); // false
```

* `/^\S+@\S+\.\S+$/`: 
  * `^`: 表開頭
  * `\S`: 表**非**空白字符
  * `+`: 表可以出現一次以上
  * `\.`: 表 `.` 符號
  * `$`: 表結尾



## 6. capitalize()
在 JS 有 `toUpperCase()` 和 `toLowerCase()` 卻沒有讓開頭大寫的方法:

```jsx
const capitalize = (str) => {
  const arr = str.trim().toLowerCase().split(" ");

  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }

  return arr.join(" ");
};

capitalize("hello, world!");
// Expected output: "Hello, World!"
```

我們也可以用 regex 來寫:
```js
const capitalize = (str) => {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
};

capitalize("hello, world!");
```

## 8. localStorage
localStorage 是非常好用的 API，他可以把一些資料存在使用者的瀏覽器上，若在某些專案上會頻繁的使用他，我們就可以將它進行封裝，來更簡易的的使用他:

```jsx
const storage = {
  get: (key, defaultValue = null) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  },

  set: (key, value) => 
    localStorage.setItem(key, JSON.stringify(value)),

  remove: (key) => localStorage.removeItem(key),

  clear: () => localStorage.clear(),
};

storage.set("name", "thisWeb");
storage.get("name");
```

我們還進一步優化這個封裝，例如：

* 添加容量限制的檢查：在將數據存儲到 localStorage 之前，先檢查已使用的存儲空間是否超過了容量限制。如果超過了限制，可以考慮刪除一些舊數據或者提示用戶清理數據。
* 添加事件監聽器：可以添加一個事件監聽器，當 localStorage 中的數據發生改變時，自動通知應用程序，以便更新相應的內容。
* 改進錯誤處理：如果 localStorage 存儲失敗或者讀取失敗，應該儘可能地捕獲錯誤並提供有用的錯誤信息，以便開發人員快速定位問題。
* 添加過期時間機制：可以在存儲數據時添加一個過期時間，當超過過期時間時，自動刪除數據或者返回默認值。
* 添加序列化和反序列化選項：可以添加對不同數據類型的支持，例如支持存儲二進制數據、日期對象等等。

```js

```