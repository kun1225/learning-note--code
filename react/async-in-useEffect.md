# 如何在 useEffect 裡使用非同步函數

此篇筆記參考 <a href="https://devtrium.com/posts/async-functions-useeffect" target="_blank">這篇 <a/> 以及 <a href="https://www.robinwieruch.de/react-hooks-fetch-data/" target="_blank">這篇</a>

## 前言

在 React 中，我們常常在 `useEffect` 裡串接 api 來獲取資料，這意味著我們會使用非同步函式來取得資料，但在 `useEffect` 使用非同步函式可能沒有你想像的簡單。

## 錯誤的使用方法
這裡有一個在串接 api 時很常見的錯誤方法:

```js
// ❌ 不要這樣做
useEffect(async () => {
  const data = await fetchData();
}, [fetchData])
```

這裡的問題是，`useEffect` 的第一個參數應該是一個不返回任何內容或是返回一個用來清除副作用的函式。但是非同步函式 `async` 會返回一個 Promise，因此會報錯。

那要怎麼寫非同步函式呢？

## 正確的方法

常見的解決辦法是在 `useEffect` 裡宣告一個非同步函式，如下:

```js
useEffect(() => {
  // 宣告非同步函式
  const fetchData = async () => {
    const data = await fetch('https://example.com');
  }

  // 調用函式
  fetchData()
    // 記得捕獲錯誤
    .catch(console.error);
}, [])
```

要注意的是，如果你想使用在非同步函式中獲得的資料，你要在 `fetchData` 內部座使用，而不是外部，如下:

```js
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('https://example.com');
    const json = await response.json();

    // 在 fetchData 內部更新獲取的資料
    setData(json);
  }

  // 調用函式
  fetchData()
    .catch(console.error)
})

// 或是這樣
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('https://example.com');
    const json = await response.json();

    return json;
  }

  // 調用函式
  fetchData()
    .then((data) => setData(data))
    .catch(console.error)
})
```
但不能這樣

```js
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('https://example.com');
    const json = await response.json();
   
    return json;
  }

  // 調用函式
  const result = fetchData()
    .catch(console.error)

  setData(result)
})
```

因為非同步函式返回的是一個 promise，並不是我們要的數據。

## 如何在 useEffct 外部宣告 fetchData？
在某些情況，你可能會需要再 useEffect 外部宣告 fetchData，並在 useEffect 內部做使用，在這種情況下，你並需要使用 useCallback 來宣告 fetchData。

這是因為如果你要在 useEffect 裡使用 fetchData，你必須要將 fetchData 放在依賴中，但每次組件渲染時，fetchData 都會更新，並重新觸發 useEffect，造成死循環
```js
// 使用 useCallback 宣告 fetchData
const fetchData = useCallback(async () => {
  const response = await fetch('https://example.com');
  const json = await response.json();

  setData(data);
}, [])

useEffect(() => {
  fetchData()
    .catch(console.error);;
}, [fetchData])
```

## 如何在有參數的情況下串接 api
有時候你會需要傳入參數給 api 來獲取指定的資料:

```js
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch(`https://yourapi.com?param=${param}`);
    const json = await response.json();

    setData(json);
  }

  fetchData()
    .catch(console.error);;
}, [param])
```

但這樣會有個問題，如果 param 改變，fetchData 將被調用兩次。如果這個改變發生的很快，就有可能產生競爭條件  race condition ，也就是第一次呼叫在第二次呼叫之後才完成，因此狀態會保存舊的值，出現我們預期之外的錯誤。

解決這個問題的方法是可以使用一個變數來控制是否更新狀態。

```js
useEffect(() => {
  let isSubscribed = true;

  const fetchData = async () => {
    const response = await fetch(`https://yourapi.com?param=${param}`);
    const json = await response.json();

    if (isSubscribed) {
      setData(json);
    }
  }

  fetchData()
    .catch(console.error);

  return () => isSubscribed = false;
}, [param])
```
在獲取資料前，若組件重新渲染，使得舊的組件卸載後，會將 isSubscribed 改成 `false`，若組件卸載後才獲取資料，就不會執行 setData，這樣可以避免多次觸發 useEffect 時，發生預期之外的錯誤。

## 如何讓使用者自己輸入 parma？
有時候我們想讓使用者利用搜尋框，搜尋之後藉由輸入的關鍵字來串 api，此時可以增加一個 state 和 input 元素:

```js
const App = () => {
  const [data, setData] = useState([]);
  const [param, setParam] = useState('');

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      const response = await fetch(`https://example.com?param=${param}`);
      const json = await response.json();

      if (isSubscribed) {
        setData(json);
      }
    }

    fetchData()
      .catch(console.error);

    return () => isSubscribed = false;
  }, [param])

  return  (
    <>
      <input
        type="text"
        value={param}
        onChange={event => setParam(event.target.value)}
      />
    </>
  )
}
```

記得將 param 放到 useEffect 的依賴陣列裡，不然 useEffect 可能會無法取得最新的 param，但這樣有一個小問題，當你每輸入一個字，都會觸發一次 useEffect 和 fetchData，頻繁的串接 api 可能會造成網站變慢。

所以我們可以設置一個搜尋按鈕和一個 url 狀態，當點擊按鈕時更改 api 的 url 並將 url 放到 useEffect 的依賴陣列:

```js
const App = () => {
  const [data, setData] = useState([]);
  const [param, setParam] = useState('');
  const [url, setUrl] = useState('https://example.com?param=param');

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      const response = await fetch(url);
      const json = await response.json();

      if (isSubscribed) {
        setData(json);
      }
    }

    fetchData()
      .catch(console.error);

    return () => isSubscribed = false;
  }, [url])

  return  (
    <>
      <input
        type="text"
        value={param}
        onChange={event => setParam(event.target.value)}
      />
      <button type="button" onClick={() => setUrl(`https://example.com?param=${param}`)}>
        Search
      </button>
    </>
  )
}
```

## 設定 loading 效果
有時候需要有 loading 效果讓使用者知道資料正在加載中，此時可以增加一個 loading 狀態:

```js
const App = () => {
  const [data, setData] = useState([]);
  const [param, setParam] = useState('');
  const [url, setUrl] = useState('https://example.com?param=param');
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch(url);
      const json = await response.json();

      if (isSubscribed) {
        setData(json);
      }
      setIsLoading(false);
    }

    fetchData()
      .catch(console.error);

    return () => isSubscribed = false;
  }, [url])

  return  (
    <>
      <input
        type="text"
        value={param}
        onChange={event => setParam(event.target.value)}
      />
      <button type="button" onClick={() => setUrl(`https://example.com?param=${param}`)}>
        Search
      </button>
      {IsLoading
        ? <div>LOADING ...</div>
        : {/* your data */}
      }
    </>
  )
}
```
## 增加錯誤提醒
```js
const App = () => {
  const [data, setData] = useState([]);
  const [param, setParam] = useState('');
  const [url, setUrl] = useState('https://example.com?param=param');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true);

      try {
        const resoonse = await fetch(url);
        const json = await response.json();

        if (isSubscribed) {
          setData(json);
        }
      } catch (error) {
        setIsError(true)
      } finally {
        setIsLoading(false);
      }
    }

    fetchData()

    return () => isSubscribed = false;
  }, [url])

  return  (
    <>
      <input
        type="text"
        value={param}
        onChange={event => setParam(event.target.value)}
      />
      <button type="button" onClick={() => setUrl(`https://example.com?param=${param}`)}>
        Search
      </button>

      {isError && <div>Something went wrong</div>}

      {isLoading
        ? <div>LOADING ...</div>
        : {/* your data */}
      }
    </>
  )
}
```

## 將 fetchData 抽離出來變客製化的 hook

在 react 中，可以把邏輯方面的程式碼抽離出來變成 hook，讓畫面和邏輯分開管理，現在我們就將 fetchData 抽離變成 hook，並傳入初始值給他:

```js
// src/hooks/useFetchData.js
const useFetchData = (initUrl, initData) => {
  const [data, setData] = useState(initData);
  const [url, setUrl] = useState(initUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const isSubscribed = true;

    const fetchData = async () => {
      setIsLoading(true);
      setIsErrpr(false);
      try {
        const response = await fetch(url);
        const json = await response.json();
        if (isSubscribed) setData(json);
      } catch(error) {
        setIsErrpr(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData()
  }, [url])

  return {data, setUrl, isLoading, isError};
}

export default useFetchData;
```
```js
// src/App.jsx

const intiUrl = 'https://example.com'

const App = () => {
  const [param, setParam] = useState('param');
  const {data, setUrl, isLoading, isError} = useFetchData(intiUrl, []);

  return  (
    <>
      <input
        type="text"
        value={param}
        onChange={event => setParam(event.target.value)}
      />
      <button type="button" onClick={() => setUrl(`https://example.com?param=${param}`)}>
        Search
      </button>

      {isError && <div>Something went wrong</div>}

      {isLoading
        ? <div>LOADING ...</div>
        : {/* your data */}
      }
    </>
  )
}

export default App
```

## 使用 useReduce 來管理所有的狀態
可以發現我們在 hook 裡有 data, isLoading, isError 等狀態，我們可以使用 useReduce 來共同管理它們

```js
const fetchDataReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
}

const useFetchData = (initUrl, initData) => {
  const [url, setUrl] = useState(initUrl);
  
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initData,
  });

  useEffect(() => {
    const isSubscribed = true;

    const fetchData = async () => {
      dispatch({type: 'FETCH_INIT'});
      try {
        const response = await fetch(url);
        const json = await response.json();
        if (isSubscribed) {
          dispatch({type: 'FETCH_SUCCESS', payload: json})
        };
      } catch(error) {
        dispatch({ type: 'FETCH_FAILURE' });
      }
    }

    fetchData()
  }, [url])

  return {state, setUrl};
}

export default useFetchData;
```

## 小結
前幾天在串接 api 時遇到很多問題，於是就上網查詢，也把查到的筆記統整成一篇文章，希望可以幫助你來更了解 useEffect 的使用。