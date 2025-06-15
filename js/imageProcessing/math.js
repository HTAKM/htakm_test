function lerp(a, b, p) {
    return a + p * (b-a);
}

function perc(x, a, b) {
    return (b - a > 0) ? (x - a) / (b - a) : a;
}

function gaussian2d(x, mean, variance) {
    return Math.exp(-Math.pow(x-mean, 2) / (2 * variance)) / (2 * Math.PI * variance);
}