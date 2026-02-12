async function loadGrade() {
    await fetch("js/grade/course-and-grade.csv")
        .then((res) => res.text())
        .then((text) => {
            let content = $.csv.toObjects(text);
            const GPAValidGrade = ['A+','A','A-','B+','B','B-','C+','C','C-','D','F'];
            const gradeTable = $("#grade-table");
            let gradeRow, termCol, codeCol, nameCol, creditCol, gradeCol;
            let term = "", termCount = 0;
            for (let i = 0; i < content.length; ++i) {
                takenCourseInfo = content[i]
                if (!(GPAValidGrade.includes(takenCourseInfo["Grade"]))) continue;
                gradeRow = $('<tr>');
                if ([takenCourseInfo["Year"], takenCourseInfo["Term"]].join(" ") == term) {
                    termCol = $('<td>', {class: "course-term", style: "display:none"}).html(term);
                    ++termCount;
                } else {
                    $('.course-term:contains('+term+')').first().attr('rowspan', termCount);
                    term = [takenCourseInfo["Year"], takenCourseInfo["Term"]].join(" ");
                    termCount = 1;
                    termCol = $('<td>', {class: "course-term"}).html(term);
                }
                codeCol = $('<td>', {class: "course-code"}).html([takenCourseInfo["Prefix"], takenCourseInfo["Code"]].join(" "));
                nameCol = $('<td>', {class: "course-name"}).html(takenCourseInfo["Name"]);
                creditCol = $('<td>', {class: "course-credit"}).html(takenCourseInfo["Credit"]);
                gradeCol = $('<td>', {class: "course-grade"}).html(takenCourseInfo["Grade"]);
                gradeRow.append(termCol);
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

$(async function() {
    await loadGrade();
    $('.custom-table tbody tr').on("mouseenter", (event) => 
        $(this).find('.course-term:contains('+$(event.target).parent().find(".course-term").html()+')').first().attr("style", "background-color: #d4a5eb;")
    )
    $('.custom-table tbody tr').on("mouseleave", (event) => 
        $(this).find('.course-term:contains('+$(event.target).parent().find(".course-term").html()+')').first().attr("style", "")
    )
});