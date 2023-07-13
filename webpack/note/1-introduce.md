# webpack 打包工具打包了甚麼

## 前言
相信 webpack 對於前端的開發者或多或少都有聽過，他是一個打包工具，那他究竟打包了甚麼，或是說他做了什麼以及解決了甚麼問題呢? 下面我們就來看看吧！

## 傳統的 JavaScript
在了解 webpack 之前，我們先來看看前端在引入 JS 方法的歷史。
在早期我們寫 HTML 和 JS 時，需要手動的將 JS 函式庫一一引入，例如我們需要 moment.js 這個函式庫的時候，就要像這樣

```html
<!-- index.html -->
<!DOCTYPE html>  
<html lang="en">  
<head>  
  <meta charset="UTF-8">  
  <title>Example</title>  
  <link rel="stylesheet" href="index.css">  
  <script src="./moment.min.js"></script> <!-- 手動引入 --> 
  <script src="./index.js"></script>  
</head>  
<body>  
  <h1>Hello World</h1>  
</body>  
</html>
```

```js
// index.js
console.log("Hello from JavaScript!");  
console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
// July 3rd 2023, 5:16:18 pm
```

這個方式的好處就是非常容易理解，然而缺點也很明顯，我們要手動的下載函式庫並引入，而當函式庫更新時，我們又要在下載一次最新版本。

所以有了 **npm (Node Package Manager)** 的誕生

## npm 套件管理工具
有了 npm 後，開發人員就可以利用指令，來快速下載各個函式庫，以 moment.js 為例子。

要利用 npm 安裝 moment.js 套件，我們需要先安裝 node.js，因為 npm 最早是設定給 node.js 使用的。下載安裝完 node.js 後，我們在終端機用

```bash
npm -v
```
來查看版本並看有沒有安裝成功。

![webpack2](./assets//images/webpack2.png)
(可以對資料夾點右建打開終端機)

接著我們新增一個資料夾來安裝 moment.js，一樣在資料夾內打開終端機

```bash
npm init -y
npm install moment --save
```

此時你會發現資料內資加了
1. node_modules
2. package.json
兩個資料夾和檔案

![webpack1](./assets//images/webpack1.png)

moment.js 的程式碼本體就在 node_modules 裡面，而 package.json 則是記錄了這個專案安裝了什麼函式庫，這樣在分享專案的時候，只要有 package.json，別人就能根據這個檔案，執行 `npm install` 來安裝所有的函式庫，不需要分享 node_modules 這個資料夾，因為這個資料夾包含所有函式庫，太大了也不好分享。

接著我們可以在 index.html 裡面引入 moment.js

```html
<!-- index.html -->  
<!DOCTYPE html>  
<html lang="en">  
<head>  
  <meta charset="UTF-8">  
  <title>JavaScript Example</title>  
  <script src="node_modules/moment/min/moment.min.js"></script> <!-- 手動引入 --> 
  <script src="./index.js"></script>  
</head>  
<body>  
  <h1>Hello from HTML!</h1>  
</body>  
</html>
```

你可以發現，儘管我們簡化了安裝的步驟，但仍然需要找到 moment.js 檔案的位置並手動引入，為了解決這樣的問題，打包工具誕生了。

## 打包工具
大部分的程式語言都提供一些方法來引入其他檔案的程式碼，但 JS 沒有，這是因為 JS 運行在瀏覽器上，為了保護使用者的安全，所以沒有辦法去讀取使用者的文件系統。

然而在 2009 年，一個名為 CommonJS 的專案計畫誕生，他讓 JS 和其他語言一樣，有了導入導出程式碼的功能，node.js 到現在都還是使用 commonJS 的規範。在 node.js 中，我們可以這樣來引入　moment.js，而 node.js 也知道各個 module 的位置，因此不需要寫 `require('./node_modules/moment/min/moment.min.js)`

```js
// index.js  
const moment = require('moment');
console.log("Hello from JavaScript!");  
console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
```

但在瀏覽器中卻會跳出錯誤訊息說 `require is not defined`，就像前面所說，JS 在瀏覽器環境沒有辦法去讀取文件，這時候打包工具誕生了，打包工具會在 build 階段，將所有 require 轉換成實際的檔案內容，最終輸出一份沒有 require 語法的 JS 檔案，讓瀏覽器能夠順利運行。而 webpack 就是現在流行的打包工具之一。

*“Build step” 是指在軟件開發過程中，將源代碼轉換為可執行文件的過程，這個步驟通常包括編譯、鏈接和打包等操作*

## 安裝 webpack
接下來我們利用 webpack 讓我們的 JS 檔案可以順利運行

```bash
npm install webpack webpack-cli --save-dev
```
我們安裝了 webpack 本體和 cli，cli 是讓我們能夠在終端機執行一些 webpack 的命令，安裝好後可以看 package.json 檔案看到相關的依賴。

```json
// package.json
{
  "name": "1-introduce",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "moment": "^2.29.4"
  },
  "devDependencies": {
    "webpack": "^5.88.1",    // 相關依賴
    "webpack-cli": "^5.1.4"
  }
}
```
接著我們在終端機執行這行命令

```bash
./node_modules/.bin/webpack ./index.js --mode=development
```
或是執行
```
npx webpack ./index.js --mode=development
```
npx 會自動在當前專案下找到相對的命令運行。

可以發現他自動新增了 dist 資料夾，裡面有一個 main.js 檔案，這就是 webpack 幫我們將所有檔案統整成一個 js 檔，點開可以發現我們寫的程式碼在前幾行，而後面幾行程式碼呢，就是一些相關的依賴，例如 moment.js 函式庫等等...

(大概會長這樣)
```js
/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("// index.js  \nconst moment = __webpack_require__(/*! moment */ \"./node_modules/moment/moment.js\");\nconsole.log(\"Hello from JavaScript!\");  \nconsole.log(moment().startOf('day').fromNow());\n\n//# sourceURL=webpack://1-introduce/./index.js?");

/***/ }),
```

接著將 html 裡的 `./index.js` 引入改成 `./dist/main.js`，就可以順利運行了。


## 小結
回到標題本身，webpack 打包工具就是將多個模塊打包成一個或多個 JS 檔案，例如上面就是將 moment.js 的本體和我們寫的程式碼打包成一個 main.js 檔案，好處是我們不再需要上網一個一個下載我們需要的函式庫並手動引入，也實現了 JS 模組化，將 JS 檔案拆分成多個檔案利於開發和維護。

所以簡單說，打包工具就是為了前端模組化誕生的東西。

當然 webpack 還有很多強大和方便的功能，這次只是大略的提及打包工具的由來，，你有興趣的話可以去 webpack 官網看看喔！

