let rowCount = 1;

function newRow() {
    var newRow = 
        '<div class="calCourseRows" id="row' + rowCount + '">' + 
        '    <div class="form-group">' +
        '        <input type="text" id="inputCourse' + rowCount + '" name="inputCourse" class="form-control" placeholder="COMP 1021" aria-label="Course Code">' +
        '    </div>' +
        '    <div class="form-group">' +
        '        <input type="number" id="inputCredit' + rowCount + '" name="inputCredit" class="form-control" placeholder="3" min="0" max="30" aria-label="Credits">' +
        '    </div>' +
        '    <div class="form-group">' +
        '        <input type="text" id="inputGrade' + rowCount + '" name="inputGrade" class="form-control" placeholder="A+" maxlength="2" aria-label="Grade">' +
        '    </div>' +
        '</div>';
    return newRow;
}

function calculateCGA() {
    const validGrades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];
    const nonCGAGrades = ["P", "PP", "IP", "PA", "PS", "NP", "T", "W", "AU", "CR", "DI", "DN", "EX", "HP", "LP", "U", "Y"];
    let gradedCredits = 0;
    let totalCredits = 0;
    let totalGradePoints = 0.0;

    for (let i = 0; i < rowCount; i++) {
        const courseInput = document.getElementById(`inputCourse${i}`)?.value;
        const creditInput = document.getElementById(`inputCredit${i}`)?.value;
        const gradeInput = document.getElementById(`inputGrade${i}`)?.value;

        if (!courseInput || !creditInput || !gradeInput) {
            continue;
        }

        const credits = parseInt(creditInput);

        if (nonCGAGrades.includes(gradeInput)) {
            totalCredits += credits;
            continue;
        }

        if (!validGrades.includes(gradeInput)) {
            return `<p>Invalid grade in Row ${i + 1}</p>`;
        }

        let gradePoint = 0.0;
        switch (gradeInput.charAt(0)) {
            case 'A':
                gradePoint = 4.0; break;
            case 'B':
                gradePoint = 3.0; break;
            case 'C':
                gradePoint = 2.0; break;
            case 'D':
                gradePoint = 1.0; break;
            case 'F':
                gradePoint = 0.0; break;
        }

        if (gradeInput.length > 1) {
            if (gradeInput.charAt(1) === '+') {
                gradePoint += 0.3;
            } else if (gradeInput.charAt(1) === '-') {
                gradePoint -= 0.3;
            }
        }

        gradedCredits += credits;
        totalGradePoints += gradePoint * credits;
        totalCredits += credits;
    }

    if (totalCredits === 0) {
        return '<p>Total credits that count towards CGA is 0!</p>'; 
    }

    const CGA = (totalGradePoints / gradedCredits).toFixed(2);
    return `<p>Result:</p>
            <p>Number of credits: ${totalCredits}</p>
            <p>Number of graded credits: ${gradedCredits}</p>
            <p>Number of ungraded credits: ${totalCredits - gradedCredits}</p>
            <p>CGA: ${CGA}</p>`;
}

document.getElementById("addRowBtn").addEventListener("click", function() {
    document.getElementById("courseForm").insertAdjacentHTML("beforeend", newRow());
    rowCount++;
});

document.getElementById("deleteRowBtn").addEventListener("click", function() {
    if (rowCount > 1) {
        const row = document.getElementById("row" + (rowCount - 1));
        if (row) {
            row.remove();
            rowCount--;
        }
    }
});

document.getElementById("submitBtn").addEventListener("click", function() {
    const result = calculateCGA();
    document.getElementById("CGAResult").innerHTML = result;
});