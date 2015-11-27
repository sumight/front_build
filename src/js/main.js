var abc = require('./common/abc');
var xyz = require('./common/xyz');
abc.init();
xyz.init();

var tpl = require("../tpl/index");
console.log(tpl);
var x = tpl({title:12});
console.log(x);

// alert(123);
// 
document.getElementById('abc').onclick = function(){
    alert('abc');
};