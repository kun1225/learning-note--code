# 如何攔截網站的複製？
之前逛掘金的時候發現複製下來的文字，掘金會自動加上一串浮水印說來自誰誰誰的文章，覺得這個攔截複製的想法蠻有趣的，今天就來看看三種攔截複製的實用方法。

## 1. 禁止複製
如果你希望你的網站不被別人複製轉貼，可以使用這個方法。
```js
document.addEventListener('copy', event => {
  // 阻止默認的複製操作
  event.preventDefault();

  // 執行自定義操作
  alert('禁止複製')
});
```
這樣當使用者按下複製時就會跳出提示框。
雖然對於開發者來說，還是有複製的方法 (按下 `F12` 哪有不能複製的東西)，不過仍然可以避免掉一些想偷文章的人。

## 2. 攔截複製
掘金使用的方法就是在複製的文字中加上自定義的其他文字，可以這樣做到:
```js
document.addEventListener('copy', (e) => {
  // 阻止預設複製事件
  e.preventDefault();

  // 獲取複製的內容
  const selectedText = window.getSelection().toString();

  // 在複製的內容中添加自己想要的內容
  const copyText = selectedText + ' - 來自我的網站';

  // 將修改後的內容寫回到剪貼簿中
  e.clipboardData.setData('text/plain', copyText);
});
```

## 3. 一鍵複製
很多程式碼的網站都有這個功能，點擊之後會自動複製，大大增加使用者的體驗:

```js
const textToCopy = '這是要複製的文字';

const textArea = document.createElement('textarea');
textArea.value = textToCopy;
document.body.appendChild(textArea);
textArea.select();

document.execCommand('copy');
document.body.removeChild(textArea);

console.log('已經自動複製了：' + textToCopy);
```
這個方法是在 body 增加一個 testArea 元素，並自動選取，選取完後執行複製，複製完後再刪除 textArea

也可以封裝成一個函式
```js
function autoCopy(content) {
  const textArea = document.createElement('textarea');
  textArea.value = content;
  document.body.appendChild(textArea);
  textArea.select();

  document.execCommand('copy');
  document.body.removeChild(textArea);

  console.log('已經自動複製了：' + content); 
}

autoCopy('這是要複製的文字');
```

## 小結
今天介紹三種常用來自定義複製的方法，有禁止複製、攔截複製、自動複製，自動複製算是很常見的功能，可以大大增加使用者的體驗，今天就這樣囉，下次見。