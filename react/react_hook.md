# React Hook
## 前言
自從 react 16.8 更新 hook 後，functional component 開始崛起  
在更新 hook 之前，functional component 不支持狀態、生命週期等功能  

簡單說，hook 就是讓 functional component 也能使用 class component 的功能

## 目錄
1. useState
2. useEffect
3. useContext
4. useMemo
5. useCallback
6. useReducer

# useState()
useState() 讓 functional component 也能有自己的狀態  
每當這個狀態更新時， react 都會自動重新渲染整個 component  

這個狀態是甚麼意思呢？  
可以想像 react 把每個組件都當成一個機器，機器裡面的一些值就稱為狀態  

在不使用狀態的情況下，變數更新時，react 就不會知道，畫面也就不會更新

```js
fuction App() {
  const count = 0;
  
  const handleClick = () => {
    count++
  }

  return (
    <button onClick=>{handleClick}>add</button>
  )
}
```
上面的按鈕不會產生效果，必須用 `useState()`

```js
import {useState} from 'react';

fuction App() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count+1)
  }

  return (
    <button onClick=>{handleClick}>add</button>
  )
}
```
# useEffect()
`useEffect()` 用來處理副作用函數  
```js
useEffect(() => {
  //effect
  return () => {
    // cleanup
  }
}, [依賴的參數：空陣列表示不依賴])
```
# useCallback()
防止因為組件重新渲染，導致某些方法備重新創建，引響效能
```js
const handleClick = useCallback(() => {
  console.log(name)
}, [name])
```
只有 name 改變後，這個函數才會被重新聲明一次  
若傳入空陣列，那麼第一次創建，若 name 改變，拿到還是舊的 name  
若不傳入第二個參數，那每次都重新聲明一次，拿到就是新的 name

# useMemo()
useCallback 的功能可以由 useMemo 取代，如果你想通過使用 useMemo 返回一個函數也是可以
```js
useCallback(fn, inputs) is equivalent to useMemo(() => fn, inputs)
```
唯一的區別是：useCallback 不會執行第一個參數函數，而是將他返回；而 useMemo 會執行第一個函數並且將函數執行結果返回  

所以前面的例子，可以返回 handleClick 來達到儲存函數的目的  

`useCallback()` 適合記憶函數；`useMemo()`適合經過函數計算得到一個確定的值

# useRef()
`useRef()` 可以讓你直接獲得 DOM 節點
```js
import {useRef} from 'react';

export dafault function App() {
  const myText = useRef()

  const handleClick = () => {
    console.log(mytext.current)
  }

  return(
    <>
      <input ref={myText}/>
      <button onClick={handleClick}>Click</button>
    </>
  )
}

```

# useContext
useContext 的提供一個方便在多個組件中共享數據的機制  
不需要一層一層的傳遞 prop   
但缺點是會讓組件複用複雜度變高，且除錯困難  
```js
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```
# useReducer
```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```