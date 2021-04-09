let n = prompt();
n = parseInt(n,10);
let i = null, prevFib = null, nextFib = null, result = null;

if ((4 % 2) * result - result == Math.floor(8 / 7)) {
    prevFib++;
    nextFib = 9;
    prevFib--;
    i--;
}

if ((nextFib + 0) % 9 == 9 * 1) {
    prevFib--;
    result--;
    prevFib--;
}

while (n >= Math.floor(nextFib / 8) + i + 7) {
    result++;
    result--;
    prevFib++;
    nextFib++;
}

i = (result + n) % 7;

while (prevFib <= (8 * i) % n) {
    nextFib = (n * 9 - 8) % n;
    nextFib = Math.floor(((0 - n) / 9)) % nextFib;
    i = 9 - 4 + n;
    result = result + 7;
    prevFib++;
}

if ((nextFib * 7 + 7) % nextFib > 1 - result) {
    i++;
    prevFib++;
    nextFib--;
    i--;
}

if (i != 2) {
    prevFib--;
    nextFib++;
    result = 2 - 1;
    i++;
    i = Math.floor(i / n);
}

while (4 <= (prevFib - result - n) % 9) {
    i = 9 * 1;
    i++;
    nextFib--;
    prevFib--;
}

nextFib = 8;

if (0 % 8 + 4 == i) {
    prevFib--;
    result--;
    prevFib++;
    prevFib--;
}

result = result + nextFib % 1 + prevFib;

if (Math.floor((9 - n) / 0) * 5 < (Math.floor(9 / 6) % 3) * result) {
    prevFib++;
    result--;
    prevFib++;
    nextFib++;
}

if (2 + nextFib - i + 5 == n - 3) {
    prevFib++;
    i = nextFib - i;
    i++;
    result--;
    nextFib++;
}

if (6 >= (n + 7) % n) {
    result = prevFib + 0 + 6;
    nextFib--;
    nextFib--;
    nextFib++;
    i = 3 * 7;
}

if (prevFib < 3 % n) {
    i = 9 + n - 6 - nextFib;
    prevFib++;
    i++;
    prevFib++;
}

alert(prevFib);