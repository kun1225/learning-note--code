# 前言

相信工程師或多或少都會使用 git 指令來上傳自己的程式碼到 github 上  

但我每次在寫 git commit message 時都很頭痛，不知道要怎麼寫能清楚知道我做了那些修改

而好的 git commit message 也能帶來這些優點：

1. 清晰的歷史記錄：當你回顧你的 Git commit log 時，每一個 commit message 將會成為你對那次修改的簡要說明。如果你能夠寫出有意義且詳盡的 commit message，那麼你的 Git log 將會更加清晰易讀，使得你和你的團隊成員能夠更快地找到所需的信息。
2. 更好的團隊協作：如果你正在與他人合作開發項目，良好的 commit message 能夠幫助其他開發者更容易地理解你的代碼修改，這將有助於減少溝通成本，使得整個團隊的工作更加高效。
3. 方便的程式碼回溯：當你需要回溯到之前的某一個 commit 時，如果該 commit 的 message 是有意義的，那麼你就可以更快地找到所需的修改，從而更加準確地回溯到過去的代碼版本。

所以如何寫好一個 git message 也很重要，利於後續的維護和合作

## 好的 git commit message 長什麼樣子

一個好的 git commit message 可能會長這個樣子

```jsx
<type>(<scope>): <subject>

<body>

<footer>
```

1. **`<type>`**: 指定 commit 的類型，例如 fix, feat, docs, style, refactor, test 等等。這有助於更好地分類和管理你的 commits。
2. **`<scope>`**: 可選參數，表示影響範圍，例如文件名、模組名、功能等等。
3. **`<subject>`**: 簡短的說明 commit 的目的，通常不超過 50 個字符。
    - 一個好的 subject 會包含
        1. 為什麼做
        2. 我怎麼做
4. **`<body>`**: 可選參數，詳細描述 commit 的修改內容。如果標題簡短不足以說明 commit 的內容，可以使用正文進行補充。補充時可以用條列式會更清楚
5. **`<footer>`**: 可選參數，通常用於關閉 issues 或者引用其他 commit。

除了 `<type>` 和 `<subject>` 以外，其他都是有需要再補充就好。

下面舉出 10 種常見的 `<type>`

 

1. **`feat`**: 新增功能（feature）
    - 新增用戶註冊的功能
    
    ```
    feat(authentication): add user registration feature
    
    Implement the user registration feature, including backend API and front-end form.
    ```
    
2. **`fix`**: 修復錯誤（bug fix）
    - 修改在登入時會出現 500 error 的錯誤
    
    ```
    fix(authentication): fix 500 error during login
    
    Fix a server-side bug that caused a 500 error when users tried to log in. The bug was caused by an incorrect database query.
    ```
    
3. **`docs`**: 文檔（documentation）
    - 更新 readme 文檔中使用 API 的例子
    
    ```
    docs(readme): update API usage example
    
    Update the README file with a new example of how to use the API to retrieve user data.
    ```
    
4. **`style`**: 格式、風格（formatting, style），不影響程式碼的運行結果
    - Format code and unify indentation style
    
    ```
    style(ui): format code and unify indentation style
    
    Format the code using a linter and unify the indentation style to use tabs instead of spaces.
    ```
    
5. **`refactor`**: 重構代碼（refactoring），沒有新功能和修 bug
    - Refactor user registration code to use shared function
    
    ```
    refactor(authentication): refactor user registration code to use shared function
    
    Refactor the user registration code to use a shared function for validation and database insertion. This simplifies the code and reduces code duplication.
    ```
    
6. **`test`**: 增加或修改測試（adding or modifying tests）
    - Add unit tests for user registration API
    
    ```
    test(authentication): add unit tests for user registration API
    
    Add unit tests to ensure that the user registration API correctly validates user data and inserts the data into the database.
    ```
    
7. **`build`**: 構建系統、外部依賴變化（build system, external dependencies）
    - Upgrade Node.js to latest version
    
    ```
    build(deps): upgrade Node.js to latest version
    
    Upgrade Node.js to the latest version to take advantage of new features and security fixes.
    ```
    
8. **`perf`**: 優化性能（performance optimization）
    - Optimize login page load speed
    
    ```
    perf(ui): optimize login page load speed
    
    Optimize the login page to reduce load times by compressing static assets and optimizing database queries.
    ```
    
9. **`chore`**: 維護性工作、代碼重構、增加測試等（maintenance work, code refactoring, adding tests, etc.）
    - Remove unused variables and functions
    
    ```
    chore(code): remove unused variables and functions
    
    Remove unused variables and functions to reduce code complexity and improve maintainability.
    ```
    
10. **`revert`**: 撤銷提交（reverting a previous commit）
    - Revert previous commit that caused critical bug
    
    ```
    revert(authentication): revert previous commit that caused critical bug
    
    Revert the previous commit that introduced a critical bug in the authentication system. This will temporarily disable the feature until a fix can be implemented.
    ```
    

## 增加 emoji

除了 git commit message 的格式以外，也可以增加 emoji 來讓畫面更豐富跟清楚(也更可愛)

不過 emoji 也不能亂用，可以參考這網站的使用方式

[gitmoji](https://gitmoji.dev/)

使用方法是在前面加上  :emoji-name 即可，例如

```jsx
:feature feat(login): add login feature
```

## 隨機生成 message

最後如果你自暴自棄覺得寫 git commit message 好麻煩

這邊推薦一個網站會隨機生成 git commit message

[https://whatthecommit.com/index.txt](https://whatthecommit.com/index.txt)

他會出現像是 `does it work? maybe. will I check? no.` `drink to much.` `Trust me, it's not badly written. It's just way above your head.`等無俚頭的句子

提交時只要這樣使用就可以隨機生成 message

`git commit -m"`curl -s http://whatthecommit.com/index.txt`"`

工作上請謹慎使用…

## 如何規範 git commit message

如果是個人的專案想嘗試有規範的 commit message  

[优雅的提交你的 Git Commit Message - 掘金 (juejin.cn)](https://juejin.cn/post/6844903606815064077#heading-2)

[Git commit message 规范 - 掘金 (juejin.cn)](https://juejin.cn/post/6844903871832145927)

[Git Commit Message 应该怎么写？ - 掘金 (juejin.cn)](https://juejin.cn/post/6960541430473293837)