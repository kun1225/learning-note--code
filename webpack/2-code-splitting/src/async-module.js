function getComponent() {
  return import('moment')
    .then(({ default: moment }) => { // 👈 注意這裡的寫法，這是 webpack 規定的
      const element = document.createElement('div');
      element.innerHTML = 
        moment().format('MMMM Do YYYY, h:mm:ss a');

    return element;
  });
}

getComponent().then((element) => {
  document.body.appendChild(element);
});
