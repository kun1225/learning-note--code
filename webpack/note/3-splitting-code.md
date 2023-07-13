# 程式碼拆分 splitting code
程式碼拆分在對岸的說法是代碼分離

程式碼拆分是 webpack 最引人注目的特性之一，它可以將 JS 拆分到多個不同 bundle 中，我們可以依據需求加載這些 bundle，這樣的好處是，我們可以有更小的 bundle，使用得當，網頁的加載速度也會變得非常快。

在 webpack 中，拆分程式碼的方法可以分為三種

1. 入口起點：使用 entry 配置手動分離代碼，缺點是多個入口共享的檔案會被重複的打包
2. 防止重複：在入口透過 dependencies 來共享文件
3. 動態導入：透過模塊的內連函數調用來拆分程式碼

因為接下來的檔案會越來越多，我們新建一個 `src` 資料夾來統一管理，把所有 js、css、img 都放到裡面

![webpack-3-code-spilliting.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/777b953e-c807-443a-8099-29e141f26599/webpack-3-code-spilliting.png)

並修改入口名稱

```jsx
module.exports = {  
  entry: './src/index.js',
	// ...
}
```

## 1. 修改入口起點

這種方法是最簡單拆分程式碼的方式，我們先在 src 裡新增一個 another-module.js 檔案，並稍微修改 index.js 檔案

```jsx
// ./src/another-module.js
import moment from 'moment'

console.log('Hello from another module');
console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));

// ./src/index.js
console.log("Hello from index");  
```

我們將 entry 改成物件，並設定多個入口的 key 值和路徑。

```jsx
module.exports = {  
  entry: {
    index: './src/index.js',
    another: './src/another-module.js'
  },  
  output: {  
    path: path.resolve(__dirname, 'public'),
    filename: 'main.[contenthash].js',  
    clean: true,
  },
	//...
}
```

此時我們執行 `npx webpack` 打包會發生錯誤，因為我們還需要針對兩個入口去打包兩個出口，方法也很簡單，將 output 的 filename 修改一下就好

```jsx
module.exports = {  
  entry: {
    index: './src/index.js',
    another: './src/another-module.js'
  },  
  output: {  
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[contenthash].js',  // 👈 修改成 [name]
    clean: true,
  },
	//...
}
```

此時 `public` 資料夾就會有兩個打包後的 JS 檔了，打開 index.html 也會發現它自動幫我們引入這兩個 JS 檔

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
	<script defer src="index.a34d9a77b221a5641ae9.js"></script>
	<script defer src="another.4649ab3fce1e52436810.js"></script>
	<!-- 👆 引入兩個JS檔 -->
</head>
<body>
  <h1>Hello from HTML!!!!</h1>
</body>
</html>
```

這樣就實現了兩個入口了

不過這樣會有個問題，若我們在 index.js 中也引入了 moment 庫，webpack 會將 moment 重複打包在兩個 js  檔案中，我們可以查看終端機來看打包完的大小

這是我們只在 another.module.js 引入 moment 的大小，可以發現 another 大得多

![webpack-3-code-spilliting2.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/41d76c82-59d3-4117-8a6b-45a8cada674d/webpack-3-code-spilliting2.png)

如果我們也在 index.js 中引入 moment，則兩個檔案都會變大

![webpack-3-code-spilliting3.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/01b37008-14ed-45ba-9de9-0381a1ea172e/webpack-3-code-spilliting3.png)

我們可以設置依賴來解決重複打包的問題

## 2. 防止重複

我們可以在 entry 裡設定 `dependOn`，這樣就可以和另一個入口共享模塊，並且我們在要外面指定 `shared-moment` 是哪個模組。

```jsx
module.exports = {  
  entry: {
    index: {
      import: './src/index.js',
      dependOn: 'shared-moment'
    },
    another: {
      import: './src/another-module.js',
      dependOn: 'shared-moment',
    },
		// 👇 在兩個入口外指定 shared-moment 是 moment
    'shared-moment': 'moment'
  },
	// ...
}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script defer src="index.269012cdaf19f17dc472.js"></script>
  <script defer src="another.b41ced3c4bbf59a8d8a1.js"></script>
  <script defer src="shared.dfb649af00d4dcff9e19.js"></script></head>
<body>
  <h1>Hello from HTML!!!!</h1>
</body>
</html>
```

### split-chunk-plugin

除了這種方法，也可以利用 webpack 內置的插件 split-chunk-plugin

我們先把入口的配置調回來，然後再配置裡新增一個 optimization

```jsx
module.exports = {   
  entry: {
    index: './src/index.js',
    another: './src/another-module.js'
  },
	output: {  
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[contenthash].js',  
    clean: true,
  },

	// ...
	// 👇 增加一個 splitChunks
	optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}
```

由於 split-chunk-plugin 是內置的 plugin 所以我們不需要安裝，直接這樣寫後，它就會自動拆分共同的程式碼了。

## 3. 動態導入

動態導入是用 ES 的 import 語法，我們先把入口的 another.module.js 和 opitimation 都註釋掉

```jsx
module.exports = {  
  // entry: {
  //   index: {
  //     import: './src/index.js',
  //     dependOn: 'shared-moment'
  //   },
  //   another: {
  //     import: './src/another-module.js',
  //     dependOn: 'shared-moment',
  //   },
  //   'shared-moment': ['moment']
  // },  
  entry: {
    index: './src/index.js',
    // another: './src/another-module.js'
  },
	// ...
	// optimization: {
  //   splitChunks: {
  //     chunks: 'all'
  //   }
  // }
}
```

然後新增一個 async.module.js

```jsx
// ./src/async.module.js
function getComponent() {
  return import('moment') // 👈 import 返回的是一個 promise，所以可以用 .then()
    .then(({ default: moment }) => { // 👈 注意這裡的寫法，這是 webpack 規定的
      const element = document.createElement('div');
      element.innerHTML = 
        moment().format('MMMM Do YYYY, h:mm:ss a');

    return element;
  });
}

getComponent().then((element) => {
  document.body.appendChild(element);
});
```

並在 index.js 引入

```jsx
// ./src/index.js
import './async-module';

console.log("Hello from index");
```

此時執行 `npx webpack` 打包後，會發現儘管我們沒有特別寫配置，webpack 依然幫我們將 moment 打包成單獨檔案。

動態導入也可以和靜態導入一起使用，只要將 `optimization` 配置取消註釋就好了

```jsx
module.exports = {   
  entry: {
    index: './src/index.js',
    another: './src/another-module.js'
  },
	output: {  
    path: path.resolve(__dirname, 'public'),
    filename: '[name].[contenthash].js',  
    clean: true,
  },

	// ...
	// 👇 取消註釋
	optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}
```