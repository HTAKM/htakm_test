let currentEffect = null;
const segmentColor = [
    [255, 0, 0, 128],
    [0, 255, 0, 128],
    [0, 0, 255, 128]];

let basicEffects = {
    noOperation: {apply: (input, info) => {
        return input;
    }},
    showComponent: {apply: (input, info) => {
        const option = $("#component-type").val();
        for (let i = 0; i < input.length; i += 4) {
            switch (option) {
                case "red":
                    input[i+1] =
                    input[i+2] = 0;
                    break;
                case "green":
                    input[i]   =
                    input[i+2] = 0;
                    break;
                case "blue":
                    input[i]   =
                    input[i+1] = 0;
                    break;
                case "alpha":
                    input[i]   =
                    input[i+1] =
                    input[i+2] = input[i+3];
                    break;
            }
            input[i+3] = 255;
        }
        return input;
    }},
    grayscale: {apply: (input, info) => {
        const option = $("#grayscale-type").val();
        let avg;
        for (let i = 0; i < input.length; i += 4) {
            switch (option) {
                case "averaging":
                    avg = (input[i] + input[i+1] + input[i+2]) / 3;
                    break;
                case "hsv-value":
                    avg = Math.max(input[i], input[i+1], input[i+2]);
                    break;
                case "luminance":
                    avg = 0.2126 * input[i] + 0.7152 * input[i+1] + 0.0722 * input[i+2];
                    break;
            }
            input[i]   =
            input[i+1] = 
            input[i+2] = avg;
        }
        return input;
    }},
    brightness: {apply: (input, info) => {
        const offset = parseInt($("#brightness-offset").val());
        const factor = parseFloat($("#contrast-factor").val());
        for (let i = 0; i < input.length; i += 4) {
            input[i]   = input[i]   * factor + offset;
            input[i+1] = input[i+1] * factor + offset;
            input[i+2] = input[i+2] * factor + offset;
            input[i]   = (input[i] > 255)   ? 255 : (input[i] < 0)   ? 0 : input[i];
            input[i+1] = (input[i+1] > 255) ? 255 : (input[i+1] < 0) ? 0 : input[i+1];
            input[i+2] = (input[i+2] > 255) ? 255 : (input[i+2] < 0) ? 0 : input[i+2];
        }
        return input;
    }},
    negation: {apply: (input, info) => {
        for (let i = 0; i < input.length; i += 4) {
            input[i]   = 255 - input[i];
            input[i+1] = 255 - input[i+1];
            input[i+2] = 255 - input[i+2];
        }
        return input;
    }},
    posterization: {apply: (input, info) => {
        const redBitDepth = parseInt($("#red-bit-depth").val());
        const greenBitDepth = parseInt($("#green-bit-depth").val());
        const blueBitDepth = parseInt($("#blue-bit-depth").val());
        const redBitMask = generateMSBMask(8, redBitDepth), greenBitMask = generateMSBMask(8, greenBitDepth), blueBitMask = generateMSBMask(8, blueBitDepth);
        for (let i = 0; i < input.length; i += 4) {
            input[i]   &= redBitMask;
            input[i+1] &= greenBitMask;
            input[i+2] &= blueBitMask;
        }
        return input;
    }},
    blur: {apply: (input, info) => {
        const w = info.w, h = info.h;
        const blurSize = parseInt($("#blur-size").val());
        const option = $("#blur-type").val();
        const midPoint = (blurSize + 1) / 2;
        const variance = midPoint / 3;
        let kernel = new Float64Array(blurSize), value;
        for (var n = 0; n < blurSize; ++n) {
            switch (option) {
                case "uniform-blur":
                    value = 1;
                    break;
                case "gaussian-blur":
                    value = gaussian2d(n, midPoint, variance);
                    break;
            }
            kernel[n] = value;
        }
        applyKernelVectorRowWise(input, kernel, w, h, "div");
        applyKernelVectorColWise(input, kernel, w, h, "div");
        return input;
    }},
    sharpen: {apply: (input, info) => {
        const w = info.w, h = info.h;
        const option = $("#sharpen-type").val();
        const detailsOnly = $("#sharpen-details-only").prop("checked");
        let detail = Float64Array.from(input);
        switch (option) {
            case "sharpen-kernel":
                const sharpenKernel = [[0, -1, 0], [-1, 4, -1], [0, -1, 0]];
                applyKernel(detail, sharpenKernel, w, h, "agg");
                for (let i = 0; i < detail.length; ++i)
                    detail[i] /= 4;
                break;
            case "unsharp-mask":
                const midPoint = 1;
                const variance = midPoint / 3;
                let kernel = new Float64Array(3);
                for (let n = 0; n < 3; ++n) 
                    kernel[n] = gaussian2d(n, midPoint, variance);
                applyKernelVectorRowWise(detail, kernel, w, h, "div");
                applyKernelVectorColWise(detail, kernel, w, h, "div");
                for (let i = 0; i < input.length; ++i)
                    detail[i] = input[i] - detail[i];
                break;
        }
        const strength = parseFloat($("#sharpen-strength").val());
        if (detailsOnly) {
            for (let i = 0; i < input.length; ++i) {
                detail[i] *= strength;
                input[i] = detail[i] + 127.5;
                input[i] = (input[i] > 255) ? 255 : (input[i] < 0) ? 0 : input[i];
            }
            for (let a = 3; a < input.length; a += 4)
                input[a] = 255;
        } else {
            for (let i = 0; i < input.length; ++i) {
                input[i] += detail[i] * strength;
                input[i] = (input[i] > 255) ? 255 : (input[i] < 0) ? 0 : input[i];
            }
        }
        return input;
    }},
    threshold: {apply: (input, info) => {
        const threshold = parseInt($("#threshold-value").val());
        let avg;
        for (let i = 0; i < input.length; i += 4) {
            avg = (input[i] + input[i+1] + input[i+2]) / 3;
            input[i]   =
            input[i+1] = 
            input[i+2] = (avg > threshold) ? 255 : (avg == threshold) ? 128 : 0;
            input[i+3] = 255;
        }
        return input;
    }},
    edgeDetect: {apply: (input, info) => {
        const w = info.w, h = info.h;
        const option = $("#edge-detect-type").val();
        const applyThreshold = $("#edge-threshold").prop("checked");
        const threshold = parseInt($("#sobel-threshold-value").val());
        let kernel1, kernel2, div;
        switch (option) {
            case "sobel":
                kernel1 = [-1, 0, 1], kernel2 = [1, 2, 1], div = Math.sqrt(32);
                break;
            case "prewitt":
                kernel1 = [1, 0, -1], kernel2 = [1, 1, 1], div = Math.sqrt(18);
                break;
        }
        let xEdge = Float64Array.from(input);
        let yEdge = Float64Array.from(input);
        applyKernelVectorRowWise(xEdge, kernel1, w, h, "agg");
        applyKernelVectorColWise(xEdge, kernel2, w, h, "agg");
        applyKernelVectorRowWise(yEdge, kernel2, w, h, "agg");
        applyKernelVectorColWise(yEdge, kernel1, w, h, "agg");
        let avg;
        for (let i = 0; i < input.length; i += 4) { 
            avg = (Math.hypot(xEdge[i], yEdge[i]) + Math.hypot(xEdge[i+1], yEdge[i+1]) + Math.hypot(xEdge[i+2], yEdge[i+2])) / 3;
            avg /= div;
            if (applyThreshold) {
                input[i]   = 
                input[i+1] = 
                input[i+2] = (avg > threshold) ? 255 : (avg == threshold) ? 128 : 0;
            } else {
                input[i] = 
                input[i+1] = 
                input[i+2] = avg;
            }
            input[i+3] = 255;
        }
        return input;
    }},
    histEqual: {apply: (input, info) => {
        const option = $("#histogram-equalization-type").val();
        let p;
        switch (option) {
            case "rgb-stretch":
                const rF = freqHist(input, 'r'), gF = freqHist(input, 'g'), bF = freqHist(input, 'b');
                const rMax = maxFreq(rF), rMin = minFreq(rF);
                const gMax = maxFreq(gF), gMin = minFreq(gF);
                const bMax = maxFreq(bF), bMin = minFreq(bF);
                for (let i = 0; i < input.length; ++i) {
                    p = perc(input[i], rMin, rMax);
                    input[i] = lerp(0, 255, p);
                    p = perc(input[i + 1], gMin, gMax);
                    input[i + 1] = lerp(0, 255, p);
                    p = perc(input[i + 2], bMin, bMax);
                    input[i + 2] = lerp(0, 255, p);
                }
                break;
            case "gray-stretch":
                const freq = freqList(input, 'g'), fMax = maxFreq(freq), fMin = maxFreq(freq);
                let avg;
                for (let i = 0; i < input.length; ++i) {
                    avg = (input[i] + input[i+1] + input[i+2]) / 3;
                    p = perc(avg, fMin, fMax);
                    input[i]   =
                    input[i+1] =
                    input[i+2] = lerp(0, 255, p);
                }
        }
        return input;
    }}
};

// Not work yet
let scaleEffects = {
    shrink: {apply: () => {
        const scale = 1.5;
        outputMemoryCanvas.scale(scale);
        outputMemoryCanvas.getContext('2d').putImageData(outputMemoryCanvas, 0, 0);
        outputImageData = outputMemoryCanvas.getContext('2d').getImageData(0, 0, scaledWidth, scaledHeight);
    }}
}

function applyBasicOperation() {
    let inputData = Float64Array.from(inputImageData.data);
    let info = {w: inputImageData.width, h: inputImageData.height};
    switch(currentOp) {
        case "no-op": 
            currentEffect = basicEffects.noOperation; 
            break;
        case "show-component":
            currentEffect = basicEffects.showComponent;
            break;
        case "grayscale":
            currentEffect = basicEffects.grayscale;
            break;
        case "brightness":
            currentEffect = basicEffects.brightness;
            break;
        case "negation": 
            currentEffect = basicEffects.negation; 
            break;
        case "posterization":
            currentEffect = basicEffects.posterization;
            break;
        case "blur":
            currentEffect = basicEffects.blur;
            break;
        case "sharpen":
            currentEffect = basicEffects.sharpen;
            break;
        case "threshold":
            currentEffect = basicEffects.threshold;
            break;
        case "edge-detection":
            currentEffect = basicEffects.edgeDetect;
            break;
        case "histogram-equalization":
            currentEffect = basicEffects.histEqual;
            break;
        default:
            return;
    }
    let outputData = currentEffect.apply(inputData, info);
    outputImageData = new ImageData(info.w, info.h);
    arrayToImageData(outputData, outputImageData);
}