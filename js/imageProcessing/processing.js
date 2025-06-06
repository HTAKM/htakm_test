var currentEffect = null;
const segmentColor = [
    [255, 0, 0, 128],
    [0, 255, 0, 128],
    [0, 0, 255, 128]];

var effects = {
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
        applyDivKernelVectorRowWise(input, kernel, w, h);
        applyDivKernelVectorColWise(input, kernel, w, h);
        return input;
    }},
    sharpen: {apply: (input, w, h) => {
        const option = $("#sharpen-type").val();
        const detailsOnly = $("#sharpen-details-only").prop("checked");
        let detailArray = [];
        switch (option) {
            case "sharpen-kernel":
                const sharpenKernel = [[0, -1, 0], [-1, 4, -1], [0, -1, 0]];
                applyAggKernelGetArray(input, detailArray, sharpenKernel);
                for (var i = 0; i < detailArray.length; ++i)
                    detailArray[i] = detailArray[i] / 4;
                break;
            case "unsharp-mask":
                const midPoint = 1;
                const variance = midPoint / 3;
                var kernelValue;
                var firstKernel = [[]], secondKernel = [];
                for (var n = 0; n < 3; ++n) {
                    kernelValue = gaussian2d(n, midPoint, variance);
                    firstKernel[0][n] = kernelValue;
                    secondKernel[n] = [kernelValue];
                }
                var intermediateData = new ImageData(inputData.width, inputData.height);
                applyDivKernelGetImageData(inputData, intermediateData, firstKernel);
                applyDivKernelGetImageData(intermediateData, outputData, secondKernel);
                for (var i = 0; i < inputData.data.length; ++i)
                    detailArray[i] = inputData.data[i] - outputData.data[i];
                break;
        }
        const strength = parseFloat($("#sharpen-strength").val());
        if (detailsOnly) {
            for (var i = 0; i < inputData.data.length; ++i) {
                detailArray[i] *= strength;
                outputData.data[i] = detailArray[i] + 127.5;
                outputData.data[i] = (outputData.data[i] > 255) ? 255 : (outputData.data[i] < 0) ? 0 : outputData.data[i];
            }
            for (var a = 3; a < inputData.data.length; a += 4)
                outputData.data[a] = 255;
        } else {
            for (var i = 0; i < inputData.data.length; ++i) {
                outputData.data[i] = inputData.data[i] + detailArray[i] * strength;
                outputData.data[i] = (outputData.data[i] > 255) ? 255 : (outputData.data[i] < 0) ? 0 : outputData.data[i];
            }
        }
    }},
    sobel: {apply: (inputData, outputData) => {
        const xKernel1 = [[-1, 0, 1]], xKernel2 = [[1], [2], [1]];
        const yKernel1 = [[1, 2, 1]], yKernel2 = [[-1], [0], [1]];
        var intermediateArray = [];
        var xEdge = [];
        var yEdge = [];
        applyAggKernelGetArray(inputData, intermediateArray, xKernel1);
        applyAggKernelToArray(intermediateArray, xEdge, xKernel2, inputData.width, inputData.height);
        applyAggKernelGetArray(inputData, intermediateArray, yKernel1);
        applyAggKernelToArray(intermediateArray, yEdge, yKernel2, inputData.width, inputData.height);
        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]   = Math.hypot(xEdge[i], yEdge[i]);
            outputData.data[i+1] = Math.hypot(xEdge[i+1], yEdge[i+1]);
            outputData.data[i+2] = Math.hypot(xEdge[i+2], yEdge[i+2]);
            outputData.data[i+3] = 255;
        }
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