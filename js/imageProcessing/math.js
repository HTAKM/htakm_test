function gaussian2d(x, mean, variance) {
    return Math.exp(-Math.pow(x-mean, 2) / (2 * variance)) / (2 * Math.PI * variance);
}