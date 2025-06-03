var currentEffect = null;

var effects = {
    noOperation: {apply: function(inputData, outputData) {
        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]   = inputData.data[i];
            outputData.data[i+1] = inputData.data[i+1];
            outputData.data[i+2] = inputData.data[i+2];
            outputData.data[i+3] = inputData.data[i+3];
        }
    }},
    negation: {apply: function(inputData, outputData) {
        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]   = 255 - inputData.data[i];
            outputData.data[i+1] = 255 - inputData.data[i+1];
            outputData.data[i+2] = 255 - inputData.data[i+2];
            outputData.data[i+3] = inputData.data[i+3];
        }
    }},
    grayscale: {apply: function(inputData, outputData) {
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
            outputData.data[i] =
            outputData.data[i+1] = 
            outputData.data[i+2] = avg;
            outputData.data[i+3] = inputData.data[i+3];
        }
    }},
    brightness: {apply: function(inputData, outputData) {
        const offset = parseInt($("#brightness-offset").val());
        const factor = parseFloat($("#contrast-factor").val());
        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]   = inputData.data[i] * factor + offset;
            outputData.data[i+1] = inputData.data[i+1] * factor + offset;
            outputData.data[i+2] = inputData.data[i+2] * factor + offset;
            outputData.data[i+3] = inputData.data[i+3];
            outputData.data[i]   = (outputData.data[i] > 255)   ? 255 : (outputData.data[i] < 0)   ? 0 : outputData.data[i];
            outputData.data[i+1] = (outputData.data[i+1] > 255) ? 255 : (outputData.data[i+1] < 0) ? 0 : outputData.data[i+1];
            outputData.data[i+2] = (outputData.data[i+2] > 255) ? 255 : (outputData.data[i+2] < 0) ? 0 : outputData.data[i+2];
        }
    }},
    posterization: {apply: function(inputData, outputData) {
        const redBitDepth = parseInt($("#red-bit-depth").val());
        const greenBitDepth = parseInt($("#green-bit-depth").val());
        const blueBitDepth = parseInt($("#blue-bit-depth").val());
        const redBitMask = generateMSBMask(8, redBitDepth), greenBitMask = generateMSBMask(8, greenBitDepth), blueBitMask = generateMSBMask(8, blueBitDepth);
        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]   = inputData.data[i] & redBitMask;
            outputData.data[i+1] = inputData.data[i+1] & greenBitMask;
            outputData.data[i+2] = inputData.data[i+2] & blueBitMask;
            outputData.data[i+3] = inputData.data[i+3];
        }
    }}
}

function applyOperation() {
    switch(currentOp) {
        case "no-op": 
            currentEffect = effects.noOperation; 
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
    }
    currentEffect.apply(inputImageData, outputImageData);
}