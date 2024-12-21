function addRow(){
    var rowCount = document.getElementsByClassName('calCourseRows').length+1;
    var newRow = 
        '<div class="calCourseRows">' + 
        '    <div class="form_course">' +
        '        <label for="inputCourse'+rowCount+'"></label>' +
        '        <input type="text" id="inputCourse'+rowCount+'" name="inputCourse" placeholder="COMP 1021">' +
        '    </div>' +
        '    <div class="form_credit">' +
        '        <label for="inputCredit'+rowCount+'"></label>' +
        '        <input type="number" id="inputCredit'+rowCount+'" name="inputCredit" placeholder="3">' +
        '    </div>' +
        '    <div class="form_grade">' +
        '        <label for="inputGrade'+rowCount+'"></label>' +
        '        <input type="text" id="inputGrade'+rowCount+'" name="inputGrade" placeholder="A+" maxlength="2">' +
        '    </div>' +
        '</div>';
    document.getElementById('courseForm').appendChild(newRow);
}
function deleteRow(){
    var rowCount = document.getElementsByClassName('calCourseRows').length;
    if(rowCount > 1){
        var removeRow = document.getElementById('courseForm').lastChild;
        removeRow.parentNode.removeChild(removeRow);
    }
}
function calculate_CGA(){
    while(document.getElementById('CGAResult').hasChildNodes()){
        document.getElementById('CGAResult').removeChild(document.getElementById('CGAResult').firstChild);
    };
    let rowCount = document.getElementsByClassName('calCourseRows').length;
    let gradedCredits = 0;
    let totalCredits = 0;
    let gradePoints = 0.0;
    let temp = 0.0;
    for(let i = 0; i < rowCount; i++){
        var credits = parseInt(document.getElementsByName('inputCredit')[i].value);
        var grade = document.getElementsByName('inputGrade')[i].value;
        switch(grade.charAt(0)){
            case 'A':
                temp = 4.0; break;
            case 'B':
                temp = 3.0; break;
            case 'C':
                temp = 2.0; break;
            case 'D':
                temp = 1.0; break;
            case 'F':
                temp = 0.0; break;
            case 'T':
            case 'P':
            case 'W':
            case 'I':
                totalCredits += credits; continue;
            default:
                document.getElementById('CGAResult').innerHTML = '<p>Wrong Grade Input!</p>';
                return;
        }
        if(grade.charAt(1) == '+'){
            temp += 0.3;
        }
        else if(grade.charAt(1) == '-'){
            temp -= 0.3;
        }
        else if(grade.charAt(1) != ''){
            continue;
        }
        totalCredits += credits;
        gradedCredits += credits;
        gradePoints += temp * credits;
    }
    if(totalCredits <= 0){
        document.getElementById('CGAResult').innerHTML = '<p>Credit is 0!</p>';
        return; 
    }
    let CGA = gradePoints / gradedCredits;
    document.getElementById('CGAResult').innerHTML = '<p>Result:</p>' +
        '<p>Number of credits: '+number_of_total_credits+'</p>' + 
        '<p>CGA: '+CGA+'</p>';   
}