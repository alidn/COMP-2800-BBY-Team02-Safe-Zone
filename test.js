var hugeArray = [];
for (var i = 0; i < 1000000; i ++) {
    hugeArray.push(Math.ceil(Math.random()*100))
}

var hugeArray2 = [];
for (var i = 0; i < 1000000; i ++) {
    hugeArray2.push(Math.ceil(Math.random()*100))
}

console.time("t");
hugeArray2.sort((a, b) => {
    if(a > b){
        return 1
    }else{
        return -1
    }
})
console.timeEnd("t");

console.time("s");
hugeArray.sort();
console.timeEnd("s");

