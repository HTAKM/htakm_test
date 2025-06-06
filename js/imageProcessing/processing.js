let currentEffect = null;
const segmentColor = [
    [255, 0, 0, 128],
    [0, 255, 0, 128],
    [0, 0, 255, 128]];

let effects = {
    noOperation: {apply: (input, w, h) => {
        return input;
    }},
    showComponent: {apply: (input, w, h) => {
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
    negation: {apply: (input, w, h) => {
        for (let i = 0; i < input.length; i += 4) {
            input[i]   = 255 - input[i];
            input[i+1] = 255 - input[i+1];
            input[i+2] = 255 - input[i+2];
        }
        return input;
    }},
    grayscale: {apply: (input, w, h) => {
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
    brightness: {apply: (input, w, h) => {
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
    posterization: {apply: (input, w, h) => {
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
    blur: {apply: (input, w, h) => {
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
        applyKernelVectorRowWise(input, kernel, w, h, "dividing");
        applyKernelVectorColWise(input, kernel, w, h, "dividing");
        return input;
    }},
    sharpen: {apply: (input, w, h) => {
        const option = $("#sharpen-type").val();
        const detailsOnly = $("#sharpen-details-only").prop("checked");
        let detail = Float64Array.from(input);
        switch (option) {
            case "sharpen-kernel":
                const sharpenKernel = [[0, -1, 0], [-1, 4, -1], [0, -1, 0]];
                applyKernel(detail, sharpenKernel, w, h, "aggregating");
                for (let i = 0; i < detail.length; ++i)
                    detail[i] /= 4;
                break;
            case "unsharp-mask":
                const midPoint = 1;
                const variance = midPoint / 3;
                let kernel = new Float64Array(3);
                for (let n = 0; n < 3; ++n) 
                    kernel[n] = gaussian2d(n, midPoint, variance);
                applyKernelVectorRowWise(detail, kernel, w, h, "dividing");
                applyKernelVectorColWise(detail, kernel, w, h, "dividing");
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
    sobel: {apply: (input, w, h) => {
        const threshold = parseInt($("#sobel-threshold").val());
        const kernel1 = [-1, 0, 1], kernel2 = [1, 2, 1];
        let xEdge = Float64Array.from(input);
        let yEdge = Float64Array.from(input);
        applyKernelVectorRowWise(xEdge, kernel1, w, h, "aggregating");
        applyKernelVectorColWise(xEdge, kernel2, w, h, "aggregating");
        applyKernelVectorRowWise(yEdge, kernel2, w, h, "aggregating");
        applyKernelVectorColWise(yEdge, kernel1, w, h, "aggregating");
        let avg;
        for (let i = 0; i < input.length; i += 4) { 
            avg = (Math.hypot(xEdge[i], yEdge[i]) + Math.hypot(xEdge[i+1], yEdge[i+1]) + Math.hypot(xEdge[i+2], yEdge[i+2])) / 3
            input[i]   = 
            input[i+1] = 
            input[i+2] = (avg > threshold) ? 255 : 0;
            input[i+3] = 255;
        }
        return input;
    }}
};

function applyOperation() {
    $("#progress-modal").modal("show");
    switch(currentOp) {
        case "no-op": 
            currentEffect = effects.noOperation; 
            break;
        case "show-component":
            currentEffect = effects.showComponent;
            break;
        case "negation": 
            currentEffect = effects.negation; 
            break;
        case "grayscale":
            currentEffect = effects.grayscale;
            break;
        case "brightness":
            currentEffect = effects.brightness;
            break;
        case "posterization":
            currentEffect = effects.posterization;
            break;
        case "blur":
            currentEffect = effects.blur;
            break;
        case "sharpen":
            currentEffect = effects.sharpen;
            break;
        case "sobel":
            currentEffect = effects.sobel;
            break;
        default:
            return;
    }
    let inputData = Float64Array.from(inputImageData.data);
    let outputData = currentEffect.apply(inputData, inputImageData.width, inputImageData.height);
    arrayToImageData(outputData, outputImageData);
}