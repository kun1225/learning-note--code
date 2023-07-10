// index.js  
const moment = require('moment');
import imgSrc from './assets/webpack.jpg';
import './index.scss';

console.log("Hello from JavaScript!!");  
console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));

const img = document.createElement('img');
img.src = imgSrc
document.querySelector('body').appendChild(img);