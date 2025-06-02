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
        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]   = inputData.data[i] + offset;
            outputData.data[i+1] = inputData.data[i+1] + offset;
            outputData.data[i+2] = inputData.data[i+2] + offset;
            outputData.data[i+3] = inputData.data[i+3];
            outputData.data[i]   = (outputData.data[i] > 255)   ? 255 : (outputData.data[i] < 0)   ? 0 : outputData.data[i];
            outputData.data[i+1] = (outputData.data[i+1] > 255) ? 255 : (outputData.data[i+1] < 0) ? 0 : outputData.data[i+1];
            outputData.data[i+2] = (outputData.data[i+2] > 255) ? 255 : (outputData.data[i+2] < 0) ? 0 : outputData.data[i+2];
        }
    }}
}

function applyOperation() {
    switch(currentOp) {
        case "noOperation": 
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
    }
    currentEffect.apply(inputImageData, outputImageData);
}