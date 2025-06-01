var currentEffect = null;

var effects = {
    noOperation: function(inputData, outputData) {
        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]   = inputData.data[i];
            outputData.data[i+1] = inputData.data[i+1];
            outputData.data[i+2] = inputData.data[i+2];
            outputData.data[i+3] = inputData.data[i+3];
        }
    },
    negation: function(inputData, outputData) {
        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]   = 255 - inputData.data[i];
            outputData.data[i+1] = 255 - inputData.data[i+1];
            outputData.data[i+2] = 255 - inputData.data[i+2];
            outputData.data[i+3] = inputData.data[i+3];
        }
    }
}

function applyOperation() {
    switch(currentOp) {
        case "noOperation": 
            currentEffect = effects.noOperation; 
            break;
        case "negation": 
            currentEffect = effects.negation; 
            break;
    }
    currentEffect(inputImageData, outputImageData);
}