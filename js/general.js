function openCSVFile(CSVfile) {
    fetch(CSVfile)
        .then((res) => res.text())
        .then((text) => {
            let csvObject = $.csv.toObjects(text);
            return csvObject;
        })
        .catch((e) => console.error(e));
}