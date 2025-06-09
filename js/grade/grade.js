function loadGrade() {
    let content;
    fetch("js/grade/course-and-grade.csv")
        .then((res) => res.text())
        .then((text) => {
            content = $.csv.toObjects(text);
        })
        .catch((e) => console.error(e));
    console.log(content);
    const gradeTable = $("#grade-table");
    let gradeRow = $('<tr>');
    let termCol = $('<td>', {class: "course-term"});
    let codeCol = $('<td>', {class: "course-code"});
    let nameCol = $('<td>', {class: "course-name"});
    let creditCol = $('<td>', {class: "course-credit"});
    let gradeCol = $('<td>', {class: "course-grade"});
    gradeRow.append(termCol);
    gradeRow.append(codeCol);
    gradeRow.append(nameCol);
    gradeRow.append(creditCol);
    gradeRow.append(gradeCol);
    gradeTable.append(gradeRow);
}

$(function() {
    loadGrade();
});