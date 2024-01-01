import './css/a.css'
import './css/b.less'
import { math } from './src/index.js'
import _ from 'lodash'
console.log(math(1,2));

let cc= math(1,2)

_.cloneDeep({a:1})
console.log(66666);

let p = new Promise((res) => {
  res(1)
})

[1,2].includes(1)
console.log(111);
document.getElementById('box').onclick = function() {
  alert(cc)
}