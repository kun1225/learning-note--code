在上篇 程式碼拆分 的最後，我們介紹了動態導入，你可能會想要動態導入有什麼用，接下來就介紹動態導入的應用之一 - 懶加載。

## 懶加載

懶加載又稱為按需加載，是非常好的優化網頁的方式，它會在需要的時候才引入相對的模組，因為有些模組可能都不會用到，若是在一開始就引入會增加網頁的負擔

我們先新增一個 `math.js` 簡單導出兩個函數

```jsx
// ./src/math.js
export const add = (x , y) => {
  return x + y;
}

export const minus = (x, y) => {
  return x - y;
}
```

並且新增一個按鈕，當點擊時會引入 math.js 裡的 add 函數

```jsx
// ./src/index.js
import './async-module';

console.log('Hello from index');

const button = document.createElement('button');
button.textContent = 'click to add';
button.addEventListener('click', () => {
  import(/*webpackChunkName: 'math'*/'./math.js').then(({ add }) => {
				 // 👆 可以像這樣指定打包後的名稱
		console.log(add(4, 5));
  });
});

document.body.appendChild(button);
```

這樣的好處是，點擊按扭前，網頁是不會載入 math.js 的，我們可以按 F12 打開開發人員的工具的 network 頁面觀察

![webpack-4-lazy-loading.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/baaf0178-a57f-4ebd-befa-9d603aff34f9/webpack-4-lazy-loading.png)

而點擊按扭動態載入後，才會引入 math.js

![webpack-4-lazy-loading2.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c52be585-169f-43b3-89c5-0a417983578a/webpack-4-lazy-loading2.png)

## 預加載

### prefetch

瀏覽器會在加載完所有的內容後，才加載 prefetch

使用方式是直接在動態導入的地方，加上 `webpackPrefetch:true`

這個的效果比前面的懶加載效果更好

```jsx
// ./src/math.js
import './async-module';

console.log('Hello from index');

const button = document.createElement('button');
button.textContent = 'click to add';
button.addEventListener('click', () => {
  import(/*webpackChunkName: 'math', webpackPrefetch: true*/'./math.js').then(({ add }) => {
    console.log(add(4, 5));
  });
});

document.body.appendChild(button);
```

### preload

和懶加載的效果類似

```jsx
// ./src/math.js
import './async-module';

console.log('Hello from index');

const button = document.createElement('button');
button.textContent = 'click to add';
button.addEventListener('click', () => {
  import(/*webpackChunkName: 'math', webpackPreload: true*/'./math.js').then(({ add }) => {
    console.log(add(4, 5));
  });
});

document.body.appendChild(button);
```