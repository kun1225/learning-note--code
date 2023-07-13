在上篇文章中我們了解到了 webpack 的由來，那今天來更深入看看 webpack 基本觀念和使用方法吧！

這篇文章分別會介紹
1. 入口
2. 出口
3. 模式
4. 插件
5. 資源模組
6. 加載器

## `webpack.config.js` 設定檔

在上篇文章中，我們要打包，需要在終端機執行以下程式碼

```jsx
npx webpack ./index.js --mode=development
```
除了我們手動打上名稱和模式，我們還可以新增 `webpack.config.js` 設定檔，來調整一些基本設定，讓我們不用每次都打這麼長的指令，比如我們可以設定入口來指定我們要打包的檔案

## 入口 entry

首先要設定的是入口，入口會告訴 webpack 我們要打包模組的起點，webpack 會自動根據這個模組的引用，一起打包其它檔案

```jsx
// ./webpack.config.js
module.exports = {
  entry: './index.js',
};
```

## 出口 output

除了入口，webpack 也可以設定出口來指定打包完的檔案，默認是放在 `./dist` 文件夾裡，除此之外，我們也可以指定檔案的名稱

```jsx
// ./webpack.config.js
const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'public'), // 👈 指定絕對路徑
    filename: 'main.bundle.js',
  },
};
```

因為 webpack 是運行在 node.js 上面，所以可以用 node.js 的語法來決定輸出的路徑

## 模式 mode

我們也可以提供模式，來告訴 webpack 當前的環境

```jsx
const path = require('path');
module.exports = {
entry: './index.js',
  output: {
		path: path.resolve(__dirname, 'public'),
    filename: 'main.bundle.js',
  },
  mode: 'development', // 👈 指定模式
};
```

此時我們已經調整好了入口、出口、模式，如果我們修改了 index.js 檔需要重新打包時，只要在終端機輸入

```bash
npx webpack --watch
```

就不用打上其它資訊了，而輸入增加 --watch，webpack 就會在更改檔案的時候，自動執行打包。

不過我們遇到了另一個問題，也就是將打包完的檔案名稱改掉後，我們要回到 `index.html` 檔手動更改引入的打包 JS 檔案

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <script src="./public/main.bundle.js"></script> 
  <!-- 👆 手動更改 -->
</head>
<body>
  <h1>Hello from HTML</h1>
</body>
</html>
```

這個問題我們可以透過插件來解決。

## 插件 plugins

webpack 提供各種插件來幫助我們達到各種功能，例如能夠解決前面手動更改檔案名稱的 `html-webpack-plugin`，接下來我們就來試著使用一些插件練習。

我們先安裝 `html-webpack-plugin` 插件，打開終端機

```bash
npm install html-webpack-plugin -D
```

接著打開 `webpack.config.js` 設定檔引入插件，

```jsx
// webpack.config.js  
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {  
  mode: 'development',  
  entry: './index.js',  
  output: {  
		path: path.resolve(__dirname, 'public'),
    filename: 'main.js',  
  },
  plugins: [ // 👈 記得加 s
    new HtmlWebpackPlugin()
  ]
};
```

此時可以發現 public 裡面多了一個 `index.html`，而且自動幫我們新增了一個 script，引入打包完的 JS 檔案

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Webpack App</title>
	  <meta name="viewport" content="width=device-width, initial-scale=1">
		<script defer src="main.bundle.js"></script>
		<!-- 👆 插件會自動幫我們引入 -->
</head>
 <body>
 </body>
```

但我們可以發現網站的標題並不是我們原本 `index.html` 所設定的，這只要在插件裡面調整模板就好

```jsx
// webpack.config.js  
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {  
  mode: 'development',  
  entry: './index.js',  
  output: {  
    filename: 'main.bundle.js',  
    path: path.resolve(__dirname, 'public'),
		clean: true // 👈 將舊的打包檔案自動刪除
  },
  plugins: [    // 👈 記得加 s
    new HtmlWebpackPlugin({
      template: './index.html' // 👈 設定模板
    })
  ]
};
```

此時他就會依據原本的 html 檔去生成新的 html 檔案

### 使用 webpack-dev-server 執行熱更新

到現在我們每次打包完都需要重新整理頁面，若希望更新檔案實自動刷新，只要安裝 `webpack-dev-server` 即可，一樣打開終端機輸入

```jsx
npm install webpack-dev-server -D
```

接著設定 webpack.config.js，這裡要注意的是，因為瀏覽器有緩存的特性，所以如果輸出的檔案名稱沒有變，那瀏覽器就會認為我們的檔案沒有變，所以我們在輸出的檔案名稱加入 `main.[contenthash].js` 這樣文件的名稱就會根據內容改變了

```jsx
// webpack.config.js  
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {  
  mode: 'development',  
  entry: './index.js',  
  output: {  
		path: path.resolve(__dirname, 'public'),
    filename: 'main.[contenthash].js',  // 👈 調整輸出的檔案名稱
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // 👈 設定路徑
    },
  }
};
```

此時我們打開終端機輸入

```jsx
npx webpack --watch
```

並打開另一個終端機輸入

```jsx
npx webpack server
```

就可以自動打包檔案，且當我們更改文件時，瀏覽器也會自動刷新了

## 資源模組 Asset Modules

到現在我們都只有打包 JS 檔案，不過 webpack 也可以引入其他資源，例如字體檔案、圖片檔案等等，分為四種

1. asset/resource : 發送單獨的檔案並自動導入 url，可用在圖片檔
2. asset/inline : 導出資源的 uri，可用在 svg
3. asset/source : 導出資源的源程式碼，可用字文字檔
4. asset : 導出資源的 uri 和源程式碼

```jsx
// webpack.config.js  
module.exports = {  

  // ...

  module: {
    rules: [
      {
        test: /\.(png\jpg)$/,   // 👈 利用正則偵測文件
        type: 'asset/resource'  // 👈 指定資源類型
      }
    ]
  }
};
```

記得每次更改 config 檔都要重新啟動 webpack 和 webpack server，此時我們回到 `index.js` 就可以引入圖片了

```jsx
// index.js
import imgSrc from './assets/webpack.jpg';

const img = document.createElement('img');
img.src = imgSrc
document.querySelector('body').appendChild(img);
```

也可以發現打包完的 public 資料夾裡面多了一個圖片檔案

## loader
webpack 真正厲害的地方是，除了資源模組，它也可以透過 loader 引入其他資源，例如 CSS、SASS 等。

可以看下面這張圖來知道 webpack 扮演的角色，由入口開始，利用 loader 引入各種資源，經過 webpack 和插件之後，會打包出一個 JS 檔案

![webpack3.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/88a92342-4add-47a3-8be6-5618244295e6/webpack3.jpg)

### 加載 CSS loader

接著我們就來看看 JS 是如何引入 CSS 檔案的。

首些我們一樣要先安裝 `css-loader`

```jsx
npm install css-loader -D
```

不過這個插件 loader 只能幫我們引入 css 檔，並不能幫我們增添樣式，所以我們還需要在安裝一個 `style-loader`

```bash
npm install style-loader -D
```

接著我們調整 wepack.config.js

```jsx
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {  

  // ...

  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        type: 'asset/resource'
      },
      {
        test: /\.css$/,                     // 👈 利用正則判斷 css 檔案
        use: ['style-loader', 'css-loader'] // 👈 使用陣列說明要使用的 loader
      }
    ]
  }
};
```

這裡要注意的是，陣列裡的順序不能反過來，因為 webpack 會由後往前使用 loader，我們必須要先用 `css-loader` 才能使用 `style-loader`

接著我們寫一個 index.css，並在 index.js 引入

```css
// ./index.css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  height: 100%;
  font-family: sans-serif;
}

body {
  background: #222;
  color: #fff;
}
```

```jsx
// index.js  
import imgSrc from './assets/webpack.jpg';
import './index.scss';

const img = document.createElement('img');
img.src = imgSrc
document.querySelector('body').appendChild(img);
```

此時就可以發現背景和字體都改變了。

### sass-loader

如果我們想要寫 sass/scss，也可以使用 webpack 來打包，首先我們要安裝 sass 和 sass-loader

```jsx
npm install sass -D
npm install sass-loader -D
```

```jsx
// webpack.config.js  
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {  
  mode: 'development',  
  entry: './index.js',  
  output: {  
		path: path.resolve(__dirname, 'public'),
    filename: 'main.[contenthash].js',  
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        type: 'asset/resource'
      },
      {
        test: /\.(css|scss|sass)$/,   // 👈 利用正則判斷 scss、sass 檔案
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
};
```

此時就可以使用 sass 了

## 小結

今天介紹了 webpack 的基礎觀念，包括入口、出口、插件、資源、加載器，希望能讓你更了解 webpack 的應用。