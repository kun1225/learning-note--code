# JS event loop
## 前言
此文章是參考[這篇](https://pjchender.dev/javascript/js-event-loop-stack-queue/)做的筆記

## 單線程(single threaded)
JS 是單線程(single threade runtime)的程式語言，所有的程式碼片段都會在堆疊(stack)被執行，且**一次只會執行一個程式碼片段**

## 堆疊 stack
在 JS 中的執行堆疊(called stack)會記錄目前執行到程式的哪個部分，如果進入到某個函式，便會把這個涵是添加到 stack 中的最上方，若程式中執行`return`，則會將函式從 stack 的最上發抽離 (pop)

### 無窮迴圈
若函式事無窮迴圈
```js
function loop() {
  return loop()
}
loop()
```
那 stack 將會被不斷疊加上去，直到瀏覽器出現錯誤

## 阻塞
當執行程式碼片段需要很長一段時間，被稱為`阻塞 blocking`，比如以同步方式模擬發出一個 request 但尚未回應前，我們沒辦法在瀏覽器執行其他任何動作，瀏覽器也沒辦法重新轉譯。

## 非同步處理與堆疊 Async Callback & Call Stack
為了解決阻塞的問題，我們可以透過非同步的方式來處理
```js
console.log('1');

setTimeout(() => {
  console.log('2');
}, 1000)

console.log('3');

// 1
// 3
// 2
```
在執行這段程式碼時，call stack 會先執行 '1'，接著執行 `setTimeout`，但是並不會馬上執行，而是先放到`工作佇列(task queue)`內，等到所有 call stack 中的內容被清空才會執行。

##　event loop
為了理解JS 之所以能透過非同步的方式，看起來一次處理很多事情，我們需要近一步了解 event loop  

我們之所以可以在瀏覽器中同時處理很多事情，是因為瀏覽器是多線程，像是 DOM、ajax、setTimeout...等都是瀏覽器提供的 api，他們都是在瀏覽器上運行的

這些在 webAPI 會在執行完成後將要執行的 call back function 放在工作佇列 task queuq

這時就輪到事件循環(event loop) 的功能了，他會判斷 call stack 是否為空，若為空就將 task queue 中的第一個項目放到 call stack ，讓他被執行

![imgae](./js-event-loop-explained.png)

## 觀察 event loop 的實用工具網站
[loupe](http://latentflip.com/loupe/?code=JC5vbignYnV0dG9uJywgJ2NsaWNrJywgZnVuY3Rpb24gb25DbGljaygpIHsKICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gdGltZXIoKSB7CiAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBidXR0b24hJyk7ICAgIAogICAgfSwgMjAwMCk7Cn0pOwoKY29uc29sZS5sb2coIkhpISIpOwoKc2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIkNsaWNrIHRoZSBidXR0b24hIik7Cn0sIDUwMDApOwoKY29uc29sZS5sb2coIldlbGNvbWUgdG8gbG91cGUuIik7!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D)

可以利用這個網站實際看到 js event loop 究竟在搞什麼鬼，以這個例子來說
```js
$.on('button', 'click', function onClick() {
    setTimeout(function timer() {
        console.log('You clicked the button!');    
    }, 2000);
});

console.log("Hi!");

setTimeout(function timeout() {
    console.log("Click the button!");
}, 5000);

console.log("Welcome to loupe.");
```
1. `$.on(...)` 放入 call stack
2. `$.on(...)` 放入 webAPIs
3. `console.log("Hi!")` 放入 call stack
4. `setTimeout()` 放入 webAPIs，並等待五秒的時間
5. 同時將 `console.log("Welcom to loupe")` 放到 call stack
6. 五秒後將 `setTimeout()` 中的 callback 放到 callback queue
7. event loop 將 callback queue 中的 function 放到 call stack 執行

點擊按鈕時，會將 click 事件放到 callback queue，並等待所有 call stack 事件執行完後才會被放到 call stack，再將 `setTimeout` 放入 webAPIs 計時，計時完後放到  callback queue，再由 event loop 放到 call stack

ajax 請求也是同理，所以 js 中看似同時執行很多事情是因為 webAPIs、callback queue、event loop 的幫忙，js 本身還是單線程的。