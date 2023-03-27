## sanitizeHTML()
在填表單時，我們為了避免用戶打 <script>…</script> 等文字來進行 XXS 攻擊，可以這樣做

```jsx
const sanitizeHTML = (str) => {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
};

sanitizeHTML("<h1>Hello, World!</h1>");
// Expected output: "&lt;h1&gt;Hello, World!&lt;/h1&gt;"
```