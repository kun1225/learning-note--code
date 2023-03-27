# Intersection Observer 交叉觀察器

前陣子做網站時遇到一個需求，當使用者滑到底部時，要獲取新的資料，就是所謂的懶加載 lazy 

最一開始的想法是用 scroll 事件處理，判斷最後一個元素是否進入畫面，當進入畫面後，執行獲取資料的函數，不過這樣有個缺點，每次滾動時都會重複執行判斷，計算量大造成性能問題。

後來我發現了 **Intersection Observer 交叉觀察器**，他是瀏覽器內建的 API，在 JS 中能直接使用，可以用來判斷 DOM 元素是否進入畫面或離開畫面，下面我就來介紹一下這個好用的 API 吧！

## 1. 甚麼是觀察器
觀察器用來針對一些不是由使用者直接觸發的事件，例如 DOM 元素進入畫面變可見狀態、DOM 元素大小、節點改變...等等，瀏覽器提供特定的 API 讓我們去監控這些變化，Intersection Observer 就是其中一個監控元素是否進入/離開畫面的觀察器。

## 2. 有那些觀察器？
1. IntersectionObserver（交叉觀察器）
2. MutationObserver（變化觀察器）
3. ResizeObserver（大小觀察器）
4. PerformanceObserver（性能觀察器）
5. ReportingObserver（報告觀察器）
   
這篇文章先講交叉觀察器，其他幾種都還在實驗階段，有興趣的可以去 MDN 看看喔！

## 3. 交叉觀察器如何使用
在 JS 中，通過 `new IntersectionObserver(callback, {options})` 即可創建觀察器，如下

```js
const target = document.querySelector('#target');

const callback = () => {
  console.log('觸發函數')
}

let options = {
  root: document.querySelector("#viewarea"),
  rootMargin: "0px",
  threshold: 1.0,
};

let observer = new IntersectionObserver(callback, options);

observer.observe(target) // 開始觀察目標
```

* callback: 當目標 DOM 元素進入物件時，觸發的函數
* options: 針對觀察器的設定，有三種屬性可以設定，分別為
    1. root: 根元素，用來判斷指目標元素是否進入到這個元素中，一定要是目標元素的父元素，默認是 `null` 舊式瀏覽器的視窗
    2. rootMargin:  類似 CSS margin 的屬性值，用來調整根元素的邊界範圍，默認為 0
    3. threshold: 目標元素進入畫面的百分比，值為 0 ~ 1，當值為 1 的時候，目標元素整個進入畫面時才會觸發 callBack
* `new IntersectionObserver()` 會返回一個物件，物件裡面有多個方法可以使用，`observe` 正是其中一個，用來開始觀察指定的目標元素。

需要注意的是，當目標元素進入畫面和離開畫面的時候都會觸發函數喔。

如果想要監聽多的目標元素，只要再用 `observe` 即可
```js
const target1 = documnt.querySelector('#target1')
const target2 = documnt.querySelector('#target2')

observer.observe(target1);
observer.observe(target2);
```
## 4. 範例

```html
<div id="target"></div>
```
```js
const target = document.querySelector('#target')    

let count = 0
const callback = () => {
  console.log('進入畫面', ++count);
}

const options = {
  threshold: 0.5
}
const observer = new IntersectionObserver(callback, options)
observer.observe(target)
```
```css
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}

body {
  height: 500vh;
  background: #23232b;
  display: grid;
  place-content: center;
}

#target {
  width: 20px;
  height: 200px;
  background-color: #e3e3e3;
}
```
(這裡放上 gif)

可以發現當目標元素有一半都進入畫面時，和一半出去畫面時，都會觸發函數。

## Intersection Observer Entry 被觀察的元素
除了上面基本的應用外，回調函數還可以接收兩個參數
```js
const callback = (entries, observer) => {
  console.log(entries);
  console.log(observer);
}
```
* observer 是觀察器本身，通常比較少使用這個參數
* entries: 是被觀察的目標元素，為一個陣列。它記錄目標元素很多有用的屬性，例如 `isIntersecting` 是一個 `boolean` 值，若目標元素和根元素相交就返回 `true`


有了 `isIntersecting` 這個屬性就可避免進入/離開畫面時觸發兩次函數的問題了，我們來改寫一下上面的例子

```js
const target = document.querySelector('#target')    

const callback = (entries) => {
  if (entries[0].isIntersecting) {
    console.log('進入畫面')
  }
}

const options = {
  threshold: 0.5
}
const observer = new IntersectionObserver(callback, options)
observer.observe(target)
```

(放上 gif)

可以發現這樣就只會在進入畫面時觸發函數了

除了這個屬性之外，`entries` 還有很多好用的屬性，例如：
1. boundingClientRect： 返回了目標元素的getBoundingClientRect的返回值。
2. intersectionRatio：返回了目標元素和根元素交叉区域的getBoundingClientRect的返回值。
3. intersectionRect： 目標元素的可見比例，相當於兩者重合多少。
4. isIntersecting： 目標元素與根元素是否相交。
5. rootBounds： 返回了根元素的getBoundingClientRect的返回值。
7. target：目標元素本身。
8. time： 從首次創建觀察者到觸髮指定閾值(threshold)發生交叉的時間

## observer 觀察器
而觀察器除了前面用到的 `observe()` 方法，也有其它好用的方法，例如：

1. observe: 開始觀察目標元素
2. disconnect：停止對所有目標元素的觀察
3. unobserve：停止對一個目標元素的觀察，可以用在組件 unmounted 時。

## 實戰範例
接著我們來做一些簡單的實戰範例:

### 1. 懶加載
```js
const observer = new IntersectionObserver((entries, observer) => { 
    entries.forEach(entry => {
        if (entry.isIntersecting) { 
            let img = entry.target;
            img.setAttribute('src', img.getAttribute('data-src')) 
            observer.unobserve(img); 
        } 
    }) 
}, {}); 
Array.from(document.querySelectorAll('img')).forEach((item) => {
  observer.observe(item)
});
```

### 2. 自動回到頂部 / 無限滾動
```js
const observer = new IntersectionObserver((entries, observer) => { 
    entries.forEach(entry => {
        if (entry.intersectionRatio <= 0) return;
        window.scrollTo({
          top: 0,
        })
    }) 
});

observer.observe(
  document.querySelector('.footer')
);
```

## 結論
總而言之，`intersectionOberserver` 是非常好用的觀察器，不管事應用在懶加載或是無限滾動都非常方便，希望這篇有幫助到你！