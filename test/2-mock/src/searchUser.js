import * as services from './services';

const searchUser = (keywords) => {
  if (!keywords) return [];

  const userArr = services.getAllUsersName();

  const searchResult = userArr.filter((name) => {
    return name.includes(keywords)
  })

  // 返回前三個結果
  return searchResult.length > 3 
    ? searchResult.slice(0, 3) 
    : searchResult;
};


export default searchUser;