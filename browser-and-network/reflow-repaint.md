在上篇文章完整講述了瀏覽器渲染頁面個過程，這裡簡單複習一下

![all-process.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0194bb3a-8476-4f2d-8ef3-bebc114e04ec/all-process.jpg)

這而這其中有三個概念對於優化網頁有很大的幫助，分別是

1. 重排
2. 重繪
3. 合成

就讓我們一一介紹吧！

## 重排 reflow

當更新元素的幾何屬性時，瀏覽器要重新計算元素的位置和大小，例如更改寬度、高度，或增刪 DOM 元素等會影響布局位置的事情，那瀏覽器就會觸發重排，如圖

!https://static001.geekbang.org/resource/image/b3/e5/b3ed565230fe4f5c1886304a8ff754e5.png

可以看出，如果你修改元素的幾何位置屬性，會幾乎重跑一次整個渲染過程，這對於瀏覽器來說開銷是大的，所以平常開發上，要盡量少去動到這些屬性，常見導致重排的操作有：

1. 添加 / 刪除可見的 DOM 元素
2. 修改元素位置屬性，例如 left、top 等
3. 改變頁面佈局，如寬高、內外邊距、浮動等
4. 改變字體

等等。

## 測試重排

我們可以像這樣來測試重排，設定一個按鈕事件，點擊後會改變 display 和 width、height

```html
<h1 class="title">
    <p>TITLE1</p>
    <p>TITLE2</p>
</h1>
<button class="button">click</button>

<script>
  const title = document.querySelector('.title');

  document.querySelector('button').addEventListener('click', () => {
    title.style.width = '600px';
    title.style.height = '800px';
    title.style.display = 'flex';
  })
</script>
```

接著打開開發工具的 performance → bottom-up，可以很清楚看到每個過程執行的時間，其中的 Layout 就是重排的時間

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/08f9eda5-6a9d-4006-b088-da2800309d33/Untitled.png)

### 重繪 Repaint

重繪是指元素的外觀 (背景、顏色 )發生改變時，瀏覽器會重新繪製元素，和重排不同，因為不會影響布局，所以 Layout 和 Layer 階段就不會執行。可以参考下图：

!https://static001.geekbang.org/resource/image/3c/03/3c1b7310648cccbf6aa4a42ad0202b03.png

因為省略了 Layout、Layer 過程，所以效率會高一點。

### 合成 Compositing

合成是最後 tiles、raster、draw 的統稱，將多個圖層合併為最終顯示的樣子，這個階段因為有大量的運算，**部分的屬性**瀏覽器會用 GPU 來加速運算，

!https://static001.geekbang.org/resource/image/02/2c/024bf6c83b8146d267f476555d953a2c.png

有趣的是，transform 並不會觸發 Layout、Layer、Paint 而是直接進入最後合成的階段，所以比起使用 left 來改變元素位置，使用 translate 的效能會更好。

更有趣的是，我們可以使用幾種方式讓瀏覽器叫 GPU 做運算，優化動畫的效能

1. will-change
    
    這是 CSS 後來新增的屬性，在你確定會使用 transform 的元素上，可以加上 will-change 來加速
    
```css
.box {
  will-change: transform;
}

.box:hover {
  transform: scale(1.1); 
}
```
    
2. 3D transform
    
    有些網站為了優話動畫效能，會故意使用 3D transform 來讓 GPU 去運算，如果你有觀察某些網站的話，他們會這樣寫
    
```css
.box {
  transform: translate3d(10px, 0, 0)
}
```
    

## 小結

今天提到了重繪、重排、合成，以及優化網站速度的小方法

而框架使用的虛擬 DOM，就是避免大量更新 DOM 來減少重排的次數。

而如果真的需要用 JS 寫 CSS 屬性，那會觸發 repaint 和 reflow 就盡量寫在一起，讓他指觸發一次 reflow & repaint