var currentEffect = null;

var effects = {
    noOperation: {apply: (inputData, outputData) => {
        copyImageData(inputData, outputData);
    }},
    showComponent: {apply: (inputData, outputData) => {
        const option = $("#component-type").val();
        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]   =
            outputData.data[i+1] =
            outputData.data[i+2] = 0;
            outputData.data[i+3] = 255;
            switch (option) {
                case "red":
                    outputData.data[i] = inputData.data[i];
                    break;
                case "green":
                    outputData.data[i+1] = inputData.data[i+1];
                    break;
                case "blue":
                    outputData.data[i+2] = inputData.data[i+2];
                    break;
                case "alpha":
                    outputData.data[i]   =
                    outputData.data[i+1] =
                    outputData.data[i+2] = inputData.data[i+3];
                    break;
            }
        }
    }},
    negation: {apply: (inputData, outputData) => {
        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]   = 255 - inputData.data[i];
            outputData.data[i+1] = 255 - inputData.data[i+1];
            outputData.data[i+2] = 255 - inputData.data[i+2];
            outputData.data[i+3] = inputData.data[i+3];
        }
    }},
    grayscale: {apply: (inputData, outputData) => {
        const option = $("#grayscale-type").val();
        let avg;
        for (var i = 0; i < inputData.data.length; i += 4) {
            switch (option) {
                case "averaging":
                    avg = (inputData.data[i] + inputData.data[i+1] + inputData.data[i+2]) / 3;
                    break;
                case "hsv-value":
                    avg = Math.max(inputData.data[i], inputData.data[i+1], inputData.data[i+2]);
                    break;
                case "luminance":
                    avg = 0.2126 * inputData.data[i] + 0.7152 * inputData.data[i+1] + 0.0722 * inputData.data[i+2];
                    break;
            }
            outputData.data[i]   =
            outputData.data[i+1] = 
            outputData.data[i+2] = avg;
            outputData.data[i+3] = inputData.data[i+3];
        }
    }},
    brightness: {apply: (inputData, outputData) => {
        const offset = parseInt($("#brightness-offset").val());
        const factor = parseFloat($("#contrast-factor").val());
        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]   = inputData.data[i]   * factor + offset;
            outputData.data[i+1] = inputData.data[i+1] * factor + offset;
            outputData.data[i+2] = inputData.data[i+2] * factor + offset;
            outputData.data[i+3] = inputData.data[i+3];
            outputData.data[i]   = (outputData.data[i] > 255)   ? 255 : (outputData.data[i] < 0)   ? 0 : outputData.data[i];
            outputData.data[i+1] = (outputData.data[i+1] > 255) ? 255 : (outputData.data[i+1] < 0) ? 0 : outputData.data[i+1];
            outputData.data[i+2] = (outputData.data[i+2] > 255) ? 255 : (outputData.data[i+2] < 0) ? 0 : outputData.data[i+2];
        }
    }},
    posterization: {apply: (inputData, outputData) => {
        const redBitDepth = parseInt($("#red-bit-depth").val());
        const greenBitDepth = parseInt($("#green-bit-depth").val());
        const blueBitDepth = parseInt($("#blue-bit-depth").val());
        const redBitMask = generateMSBMask(8, redBitDepth), greenBitMask = generateMSBMask(8, greenBitDepth), blueBitMask = generateMSBMask(8, blueBitDepth);
        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]   = inputData.data[i]   & redBitMask;
            outputData.data[i+1] = inputData.data[i+1] & greenBitMask;
            outputData.data[i+2] = inputData.data[i+2] & blueBitMask;
            outputData.data[i+3] = inputData.data[i+3];
        }
    }},
    blur: {apply: (inputData, outputData) => {
        const blurSize = parseInt($("#blur-size").val());
        const option = $("#blur-type").val();
        const midPoint = (blurSize + 1) / 2;
        const variance = midPoint / 3;
        var kernelValue;
        var firstKernel = [[]], secondKernel = [];
        for (var n = 0; n < blurSize; ++n) {
            switch (option) {
                case "uniform-blur":
                    kernelValue = 1;
                    break;
                case "gaussian-blur":
                    kernelValue = gaussian2d(n, midPoint, variance);
                    break;
            }
            firstKernel[0][n] = kernelValue;
            secondKernel[n] = [kernelValue];
        }
        var intermediateData = new ImageData(inputData.width, inputData.height);
        applyDivKernelGetImageData(inputData, intermediateData, firstKernel);
        applyDivKernelGetImageData(intermediateData, outputData, secondKernel);
    }},
    sharpen: {apply: (inputData, outputData) => {
        const option = $("#sharpen-type").val();
        const detailsOnly = $("#sharpen-details-only").prop("checked");
        let detailArray = [];
        switch (option) {
            case "sharpen-kernel":
                const sharpenKernel = [[0, -1, 0], [-1, 4, -1], [0, -1, 0]];
                applyAggKernelGetArray(inputData, detailArray, sharpenKernel);
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
    }
    currentEffect.apply(inputImageData, outputImageData);
}