function loadGrade() {
    fetch("js/grade/course-and-grade.csv")
        .then((res) => res.text())
        .then((text) => {
            let content = $.csv.toObjects(text);
            const GPAValidGrade = ['A+','A','A-','B+','B','B-','C+','C','C-','D','F'];
            const gradeTable = $("#grade-table");
            let gradeRow, termCol, codeCol, nameCol, creditCol, gradeCol;
            let term = "", termCount = 0;
            for (let i = 0; i < content.length; ++i) {
                if (!(GPAValidGrade.includes(content[i]["Grade"]))) continue;
                gradeRow = $('<tr>');
                if (["Year",content[i]["Year"],content[i]["Term"]].join(" ") == term) {
                    ++termCount;
                } else {
                    $('.course-term:contains('+term+')').attr('rowspan', termCount);
                    term = ["Year",content[i]["Year"],content[i]["Term"]].join(" ");
                    termCount = 1;
                    termCol = $('<td>', {class: "course-term"}).html(term);
                    gradeRow.append(termCol);
                }
                codeCol = $('<td>', {class: "course-code"}).html([content[i]["Prefix"],content[i]["Code"]].join(" "));
                nameCol = $('<td>', {class: "course-name"}).html(content[i]["Name"]);
                creditCol = $('<td>', {class: "course-credit"}).html(content[i]["Credit"]);
                gradeCol = $('<td>', {class: "course-grade"}).html(content[i]["Grade"]);
                gradeRow.append(codeCol);
                gradeRow.append(nameCol);
                gradeRow.append(creditCol);
                gradeRow.append(gradeCol);
                gradeTable.append(gradeRow);
            }
            $('.course-term:contains('+term+')').attr('rowspan', termCount);
        })
        .catch((e) => console.error(e));
}

function modifyTable() {

}

$(function() {
    loadGrade();
    modifyTable();
});