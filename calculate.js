var rowCount = 1
$("#addRowBtn").click(function(){
    $("#courseForm").append(newRow());
    rowCount++;
})
$("#deleteRowBtn").click(function(){
    if(rowCount > 1){
        $("#courseForm").children().last().remove();
        rowCount--;
    }
})
$("#submitBtn").click(function(){
    $("#CGAResult").html(calculateCGA())
})
function newRow(){
    var newRow = 
        '<div class="calCourseRows">' + 
        '    <div class="form_course">' +
        '        <label for="inputCourse'+rowCount+'"></label>' +
        '        <input type="text" id="inputCourse'+rowCount+'" name="inputCourse" placeholder="COMP 1021">' +
        '    </div>' +
        '    <div class="form_credit">' +
        '        <label for="inputCredit'+rowCount+'"></label>' +
        '        <input type="number" id="inputCredit'+rowCount+'" name="inputCredit" placeholder="3" min="0" max="30">' +
        '    </div>' +
        '    <div class="form_grade">' +
        '        <label for="inputGrade'+rowCount+'"></label>' +
        '        <input type="text" id="inputGrade'+rowCount+'" name="inputGrade" placeholder="A+" maxlength="2">' +
        '    </div>' +
        '</div>';
    return newRow;
}
function calculateCGA(){
    const validGrades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F", "AU", "CR", "DI", "DN", "IP", "P", "PP", "I", "PA", "PS", "T", "W", "HP", "LP", "U", "Y"];
    let gradedCredits = 0;
    let totalCredits = 0;
    let totalGradePoints = 0.0;
    let gradePoint = 0.0;
    for(let i = 0; i < rowCount; i++){
        var courseInput = $('#inputCourse'+i).val()
        var creditInput = $('#inputCredit'+i).val()
        var gradeInput = $('#inputGrade'+i).val()
        if (!courseInput || !creditInput || !gradeInput){
            continue
        }
        var credits = parseInt(creditInput)
        if (!validGrades.some(grade => (String(grade) == String(gradeInput)))) {
            return "Invalid grade in Row " + (i+1)
        }
        switch(gradeInput.charAt(0)){
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
            default:
                totalCredits += credits;
                continue;
        }
        if(gradeInput.charAt(1) == '+'){
            gradePoint += 0.3;
        }
        else if(gradeInput.charAt(1) == '-'){
            gradePoint -= 0.3;
        }
        totalCredits += credits;
        if(gradeInput.charAt(1) != ''){
            continue;
        }
        gradedCredits += credits;
        totalGradePoints += gradePoint * credits;
    }
    if(totalCredits <= 0){
        return '<p>Credit is 0!</p>'; 
    }
    let CGA = totalGradePoints / gradedCredits;
    return '<p>Result:</p>' +
           '<p>Number of credits: '+totalCredits+'</p>' + 
           '<p>CGA: '+CGA+'</p>'
}
