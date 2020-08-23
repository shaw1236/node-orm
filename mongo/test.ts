
interface square {
    width: number;
    length: number;
}

let a: square = {width: 1, length: 0};

a.width = 10;
a.length = 20;

console.log(a);
