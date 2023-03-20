# 前端必學三招，哪個能更精確地取得元素位置？：offsetLeft vs. getBoundingClientRect() vs. window.innerHeight vs. window.scrollY  大比拚
我們有時候在做網頁特效時，常常會遇到要判斷元素位置或高度、寬度、甚至頁面滾動距離的情況，這篇貼文就來好好比較常用的屬性，一次搞懂，找到最適合你專案的做法。

# offsetWidth | offsetHeight | offsetLeft | offsetTop 
* offsetWidth | offsetHeight: 整個元素的寬度/高度，會包含 border + padding
* offsetLeft | offsetTop: 回傳元素左上角相對於其定位**父元素**（positioned ancestor）的距離。

這裡多補充比較不常用兩個屬性

* clientWidth | clientHeight: 元素padding + 內容的高/寬度，**不包含 border**
* clientLeft | clientTop: 元素 padding + 內容距離左上角的位置，簡單說就是 border 的寬度... 

# getBoundingClientRect()
getBoundingClientRect() 方法主要可以取得指定元素相對於**視窗（viewport）**左上角的位置，因此如果該元素在頁面滾動時位置也會跟著改變。

他會回傳好幾個屬性，有
1. x：該元素距離視窗左邊緣的 X 座標
2. y：該元素距離視窗上邊緣的 Y 座標
3. width：該元素的寬度
4. height：該元素的高度
5. top：該元素距離視窗上邊緣的 Y 座標，和 x 一樣
6. right：該元素距離視窗右邊緣的 X 座標，和 y 一樣
7. bottom：該元素距離視窗下邊緣的 Y 座標
8. left：該元素距離視窗左邊緣的 X 座標

使用方法為
```js
const element = document.getElementById('my-element');
const rect = element.getBoundingClientRect();

console.log(rect.x); // 該元素距離視窗左邊緣的 X 座標
console.log(rect.y); // 該元素距離視窗上邊緣的 Y 座標
console.log(rect.width); // 該元素的寬度
console.log(rect.height); // 該元素的高度
```

# getBoundingClientRect().x | .y 和 offsetLeft | offsetTop 的比較
`getBoundingClientRect().x | .y` 主要是相對於**視窗**的位置；而 `offsetLeft | offsetTop` 是相對於**父元素**，所以使用的情況不一樣，如果希望滾動到某個位置時，觸發元素的效果，可以像下面這樣判斷

```js
const myElements = document.querySelectorAll('.myElements');

window.addEventListener('scroll', showBoxes);
function showElements() {
  // 觸發位置在畫面 4/5 的地方
  const triggerBottom = (window.innerHeight / 5) * 4;

  myElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;

    // 當 element 的頂部 超過 觸發位置時
    if (elementTop < triggerBottom) {
      element.classList.add('show');
    } else {
      element.classList.remove('show');
    }
  });
```

# 畫面寬度 / 高度大比拚

如果我們想獲得畫面寬高度的一些資訊，可以考慮下面幾個屬性
* window.innerHeight | window.innerWidth: 取得視窗的高度和寬度，要注意的是他是**包括滾動條寬度的**

如果不希望把滾動條算進來，可以使用
* document.documentElement.clinetWidth | document.documentElement.clinetHeight

如果想計算整個文檔的高度或寬度可以使用
* document.documentElement.scrollWidth | document.documentElement.scrollHeight

如果想知道整個螢幕的資訊，可以使用
* window.screen

# 取得滾動位置的方法
有時候我們可能會想知道用戶滾動頁面多少距離，可以使用
1. window.scrollY | window.scrollX
2. window.pageYOffset | window.pageXOffset 
來獲取滾動的距離

它們兩個差別是，`window.scrollY` 比較新，`window.pageYOffset` 是舊屬性  
所以對於現代瀏覽器來說，推薦使用 `window.scrollY`  
當然我們也可像下面這樣兼容新舊瀏覽器
```js
const scrollTop = window.scrollY || window.pageYOffset;
```

# 如何取得元素的絕對位置

讀到這裡你會發現好像沒有直接取得元素絕對位置的方法  
不過我們可以透過下面這樣取得絕對位置   

```js
const element = document.getElementById('my-element');
const rect = element.getBoundingClientRect();
const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
const absoluteTop = rect.top + scrollTop;
const absoluteLeft = rect.left + scrollLeft;

console.log(absoluteTop); // 元素在整個網頁文檔中的上邊緣位置
console.log(absoluteLeft); // 元素在整個網頁文檔中的左邊緣位置
```