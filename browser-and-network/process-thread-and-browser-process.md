## 並行處理 (平行計算 parallel computing)

電腦的並行處理就是同一時間處理多個任務，比如我們要計算以下三個值

```jsx
A = 1 + 2
B = 20 / 5
C = 7 * 8
```

我們可以把過程拆成四個任務

1. 計算 A
2. 計算 B
3. 計算 C 
4. 顯示結果

如果使用單線程執行任務，那就會依照順序分別執行這些任務

但如果採用多線程，我們就只需要分成兩步

1. 使用三個線程執行前三個任務
2. 顯示結果

可以發現使用多線程來並行處理，可以大大提升性能。

而 JS 是一個單線程語言，會這樣設計是因為 JS 往往需要跟使用者交互，很多事情必須要按照順序執行。

如果我們在寫 JS 時，寫上一個運算量很大的迴圈，就可以發現迴圈下面的程式碼會過很久才執行，這樣就證明他是單線程的程式語言

```jsx
let i = 0, total = 0;
while ( i < 1000000) {
	total += i;
}

console.log('...') // 過一段時間才會打印
```

## 進程與線程

多線程可以並行處理任務，但是線程是不能單獨存在的，它是**由進程來啟動和管理的**。那什麼又是進程呢？

一個進程就是一個程序的運行實例。詳細解釋就是，啟動一個程序的時候，操作系統會為該程序創建一塊內存，用來存放代碼、運行中的數據和一個執行任務的主線程，我們把這樣的一個運行環境叫進程。

![3380f0a16c323deda5d3a300804b95da.webp](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9b867f3c-2ac7-4eba-8bc3-d9a9aa4dd7dc/3380f0a16c323deda5d3a300804b95da.webp)

從圖中可以看到，線程是依附於進程的，而進程中使用多線程並行處理能提昇運算效率

而進程和線程之間的關係有以下四個特點：

1. 進程中的任一線程出錯，都會導致整個進程崩潰
2. 線程之間共用進程中的數據。
3. 當一個進程關閉之後，操作系統會回收進程所佔用的內存。
4. 進程之間的內容相互隔離。

進程隔離是為保護操作系統中進程互不干擾的技術，每一個進程只能訪問自己佔有的數據，也就避免出現進程A寫入數據到進程B的情況。正是因為進程之間的數據是嚴格隔離的，**所以一個進程如果崩潰了，或者掛起了，是不會影響到其他進程的。**如果進程之間需要進行數據的通信，這時候，就需要使用用於進程間通信**（IPC）**的機制了。
## 多進程瀏覽器

### 早期的多進程架構

![cdc9215e6c6377fc965b7fac8c3ec960.webp](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2c663c5f-c846-4264-9ba1-08148fd86265/cdc9215e6c6377fc965b7fac8c3ec960.webp)

### 現代的多進程架構

![b61cab529fa31301bde290813b4587fc.webp](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d58b15d9-0927-4a78-9655-94feeab589dc/b61cab529fa31301bde290813b4587fc.webp)

- 瀏覽器進程。主要負責界面顯示、用戶交互、子進程管理，同時提供存儲等功能。
- 渲染進程。核心任務是將 HTML、CSS 和 JavaScript 轉換為用戶可以與之交互的網頁，排版引擎Blink和JavaScript引擎V8都是運行在該進程中，默認情況下，Chrome會為每個Tab標籤創建一個渲染進程。出於安全考慮，渲染進程都是運行在沙箱模式下。
- GPU進程。其實，Chrome剛開始發布的時候是沒有GPU進程的。而GPU的使用初衷是為了實現3D CSS的效果，只是隨後網頁、Chrome的UI界面都選擇採用GPU來繪製，這使得GPU成為瀏覽器普遍的需求。最後，Chrome在其多進程架構上也引入了GPU進程。
- 網絡進程。主要負責頁面的網絡資源加載，之前是作為一個模塊運行在瀏覽器進程裡面的，直至最近才獨立出來，成為一個單獨的進程。
- 插件進程。主要是負責插件的運行，因插件易崩潰，所以需要通過插件進程來隔離，以保證插件進程崩潰不會對瀏覽器和頁面造成影響

不過凡事都有兩面性，雖然多進程模型提升了瀏覽器的穩定性、流暢性和安全性，但同樣不可避免地帶來了一些問題

- 更高的資源佔用。因為每個進程都會包含公共基礎結構的副本（如JavaScript運行環境），這就意味著瀏覽器會消耗更多的內存資源。
- 更複雜的體系架構。瀏覽器各模塊之間耦合性高、擴展性差等問題，會導致現在的架構已經很難適應新的需求了