# 自己動手寫 7 個好用的 JS 函數

## 1. console.log()
相信大家寫 JS 時很常使用 console.log() 來檢查自己寫的程式，我們可以利用解構附值來更簡短的使用

```jsx
const {log} = console;

log('Hello World!');

console.log('Hello World');
```


## 2. random()
Math.random() 可以隨機產生 0 ~ 1 的數字，如果我們想要獲得 0 ~ 10 的數字就必須要 Math.random() * 10 來使用，所以我們可以把 Math.random() 封裝起來讓他更易使用

```jsx
const random = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

random (3, 10) // 3 ~ 10
```


## 3. setTimes()
如果我們想要每隔一段時間執行指定的函數，可以使用 setInterval()，但如果我們希望執行指定的次數，JS 就沒有提共相對的 API，不過我們仍然可以這樣封裝

```jsx
const setTimes = (func, n) => {
	Array.from(Array(n)).forEach(() => {
		func();
	})
}
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

validateEmail("youremail@org.com"); // true
validateEmail("youremail@com"); // false
validateEmail("youremail.org@com"); // false
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
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  remove: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
};

storage.set("motto", "Eat, Sleep, Code, Repeat");
storage.get("motto");
```