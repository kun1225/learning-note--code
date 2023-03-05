# React Hook
## 前言
自從 react 16.8 更新 hook 後，functional component 開始崛起  

雖然官方一直提倡 functional component，不過當我們要使用到 state 時，還是要將 functional component 轉換成 class component  

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
* effect 在 render 後按照前後順序執行
* effect 在沒有任何依賴時，每次 re-render 都會執行

# useCallback()
每次父組件重新渲染時，子組件也會重新渲染，如果子組件接收到的是一個新的函數或物件，他也會重新渲染，他也會重新渲染，即使這個函數或物件的值沒有改變，就可以用 `useCallback()` 可以避免不必要的重新渲染  
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
在某些場景，useReducer 會比 useState 更適用，當 state 邏輯較複雜時，就可以使用 useReducer 代替  

```js
const [state, dispatch] = useReducer(reducer, initialState, init?)
```
* reducer 能通過設定好的 action 將 state 從一個過程轉換成另一個過程的純函數
* initialState 初始化的 state
* init 是初始化 state 的函數，非必要參數
* dispatch 用來觸發 action

數據流會是：dispatch(action) => reducer 更新 state => 返回更新後得 state

以下面的例子，假設我們有一個計數器和增加減少數字的兩個按鈕  
如果要用 useReduce 就這樣

1. 宣告 initalState
2. 定義 reducer 函數，其中用 action.type 來判斷要增加數字還是減少數字，state 會記錄原本的 count，所以要記得返回新的 count
3. 函數組件中宣告 useReducer
4. 使用時用 dispatch({type: ...})
  
```js
// 1
const initialState = { count :0 };
// 2
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.conut - 1};
    default: 
      throw new Error()
  }
}

function Counter() {
  // 3
  const [state, dispatch] = useReducer(reducer, initialState);

  const addCount = () => {
    // 4
    dispatch({type: 'decrement'});
  };

  const decreseCount = () => {
    dispatch({type: 'decrement'})
  }

  return (
    <>
      Count: {state.count};
      <button onClick={addCount}> + </button>
      <button onClick={decreaseCount}> - </button>
    </>
  )
}
```