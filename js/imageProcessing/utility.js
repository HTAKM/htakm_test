"use strict";

function cleanFloatArray(array) {
    for (let n = 0; n < array.length; ++n)
        array[n] = 0;
}

function fitToImage(x, y, width, height) {
    if (x < 0) 
        x = 0;
    if (x >= width) 
        x = width - 1;
    if (y < 0) 
        y = 0;
    if (y >= height) 
        y = height - 1;
    return (x + y * width) * 4;
}

function generateMSBMask(maxBits, bits) {
    let mask = 0;
    const setMask = Math.pow(2, maxBits - 1);
    for (let n = 0; n < bits; ++n) {
        mask >>= 1;
        mask |= setMask;
    }
    return mask;
}

function generateLSBMask(maxBits, bits) {
    let mask = 0;
    for (let n = 0; n < bits; ++n) {
        mask <<= 1;
        mask |= 1;
    }
    return mask;
}

function arrayToImageData(array, imageData) {
    for (let i = 0; i < imageData.data.length; ++i)
        imageData.data[i] = array[i];
}

function getPixelFromImageData(imageData, x, y) {
    let i = fitToImage(x, y, imageData.width, imageData.height);
    return {r: imageData.data[i], g: imageData.data[i+1], b: imageData.data[i+2], a: imageData.data[i+3]}
}

function getPixelFromArray(array, x, y, width, height) {
    let i = fitToImage(x, y, width, height);
    return {r: array[i], g: array[i+1], b: array[i+2], a: array[i+3]}
}

function aggPixelColor(array, x, y, width, height, color) {
    let i = fitToImage(x, y, width, height);
    array[i]   += color.r;
    array[i+1] += color.g;
    array[i+2] += color.b;
    array[i+3] += color.a;
}

function copyArray(input, output) {
    for (let i = 0; i < input.length; ++i)
        output[i] = input[i];
}

function copyImageData(input, output) {
    for (let i = 0; i < input.data.length; ++i)
        output.data[i] = input.data[i];
}

function arrayToImageData(sourceArray, targetImageData) {
    for (let i = 0; i < Math.min(sourceArray.length, targetImageData.data.length); ++i)
        targetImageData.data[i] = sourceArray[i];
}

// Apply kernel vector on image array row-wise inplace
function applyKernelVectorRowWise(array, kerVec, w, h, mode="div") {
    let r = (kerVec.length - 1) / 2;
    let div = (mode == "div") ? kerVec.reduce((a, b) => a + b, 0) : 1;
    let sum = new Float64Array(4 * w);
    let pixel, agg;
    for (let y = 0; y < h; ++y) {
        cleanFloatArray(sum);
        for (let x = 0; x < w; ++x) {
            for (let k = -r; k <= r; ++k) {
                pixel = getPixelFromArray(array, x + k, y, w, h);
                agg = {
                    r: pixel.r * kerVec[k + r],
                    g: pixel.g * kerVec[k + r],
                    b: pixel.b * kerVec[k + r],
                    a: pixel.a * kerVec[k + r]
                };
                aggPixelColor(sum, x, 0, w, 1, agg);
            }
        }
        for (let x = 0; x < w; ++x) {
            for (let offset = 0; offset < 4; ++offset)
                array[(y * w + x) * 4 + offset] = sum[x * 4 + offset] / div;
        }
    }
}

// Apply kernel vector on image array col-wise inplace
function applyKernelVectorColWise(array, kerVec, w, h, mode="div") {
    let r = (kerVec.length - 1) / 2;
    let div = (mode == "div") ? kerVec.reduce((a, b) => a + b, 0) : 1;
    let sum = new Float64Array(4 * h);
    let pixel, agg;
    for (let x = 0; x < w; ++x) {
        cleanFloatArray(sum);
        for (let y = 0; y < h; ++y) {
            pixel = getPixelFromArray(array, x, y, w, h);
            for (let k = -r; k <= r; ++k) {
                pixel = getPixelFromArray(array, x, y + k, w, h);
                agg = {
                    r: pixel.r * kerVec[k + r],
                    g: pixel.g * kerVec[k + r],
                    b: pixel.b * kerVec[k + r],
                    a: pixel.a * kerVec[k + r]
                };
                aggPixelColor(sum, 0, y, 1, h, agg);
            }
        }
        for (let y = 0; y < h; ++y)
            for (let offset = 0; offset < 4; ++offset)
                array[(y * w + x) * 4 + offset] = sum[y * 4 + offset] / div;
    }
}

function applyKernel(input, kernel, w, h, mode="div") {
    let kernelHeight = kernel.length,   rh = (kernelHeight - 1) / 2;
    let kernelWidth = kernel[0].length, rw = (kernelWidth - 1) / 2;
    let div = (mode == "div") ? kernel.reduce((acc, cur) => acc + cur.reduce((acc, cur) => acc + cur, 0), 0) : 1;
    let output = new Float64Array(input.length)
    for (let x = 0; x < w; ++x) {
        for (let y = 0; y < h; ++y) {
            let result = {r: 0, g: 0, b: 0, a: 0}, pixel;
            for (let i = -rw; i <= rw; ++i) {
                for (let j = -rh; j <= rh; ++j) {
                    pixel = getPixelFromArray(input, x + i, y + j, w, h);
                    result.r += pixel.r * kernel[j + rh][i + rw];
                    result.g += pixel.g * kernel[j + rh][i + rw];
                    result.b += pixel.b * kernel[j + rh][i + rw];
                    result.a += pixel.a * kernel[j + rh][i + rw];
                }
            }
            let i = (x + y * w) * 4;
            output[i]   = result.r / div;
            output[i+1] = result.g / div;
            output[i+2] = result.b / div;
            output[i+3] = result.a / div;
        }
    }
    copyArray(output, input);
}

function freqHist(input, mode='red') {
    let freq = new Int32Array(256);
    for (let i = 0; i < input.length; i += 4) {
        switch (mode) {
            case 'red':
                ++freq[Math.round(input[i])];
                break;
            case 'green':
                ++freq[Math.round(input[i+1])];
                break;
            case 'blue':
                ++freq[Math.round(input[i+2])];
                break;
            case 'gray':
                let avg = (input[i] + input[i+1] + input[i+2]) / 3;
                ++freq[Math.round(avg)];
                break;
        }
    }
    return freq;
}

function maxFreq(freq) {
    for (let i = freq.length - 1; i >= 0; --i)
        if (freq[i] > 0) return i;
}

function minFreq(freq) {
    for (let i = 0; i < freq.length; ++i)
        if (freq[i] > 0) return i;
}