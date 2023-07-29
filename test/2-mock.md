# Jest 單元測試模組間的依賴

單元測試可以分為獨立形測試單元和社交形測試單元，這兩者的差別就是測試單元是否有使用到其他模組。

比如我們有搜尋使用者 `searchUser` 的函數，它可能會依賴前端串接後端資料的函數 `getAllUsersName`，如果每個測試我們都要真的串接資料，會浪費很多資源和時間。

而且在測試 `searchUser` 函數時，我們也不希望暴露 `getAllUsersName` 的細節。

所以 jest 提供 mock(模擬) 的方法，讓我們模擬資料或函數，以此來確保每個測試的獨立性。

接下來就讓我們看看以上情況要怎麼用 mock 來解決並寫出測試吧！

## getAllUsersName & searchUser

## mock

## mockImplementation

## 測試錯誤、測試大小寫

## 小結

