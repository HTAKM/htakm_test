function openCSVFile(CSVfile) {
    fetch(CSVfile)
        .then((res) => res.text())
        .then((text) => console.log(text))
        .catch((e) => console.error(e));
}

function processCSVFile(file) {
    if (file.readyState == 4) {
        if (file.status == 200 || file.status == 0) {
            let contents = file.responseText;
            let csvObject = $.csv.toObjects(contents);
            return csvObject;
        } else {
            alert('There is a problem reading the csv file. ' + httpRequest.status + httpRequest.responseText);
        }
    }
}