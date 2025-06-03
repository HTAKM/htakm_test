function generateMSBMask(maxBits, bits) {
    var mask = 0;
    const setMask = Math.pow(2, maxBits - 1);
    for (var n = 0; n < bits; ++n) {
        mask >>= 1;
        mask |= setMask;
    }
    return mask;
}
function generateLSBMask(maxBits, bits) {
    var mask = 0;
    for (var n = 0; n < bits; ++n) {
        mask <<= 1;
        mask |= 1;
    }
    return mask;
}