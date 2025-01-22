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
        '        <input type="number" id="inputCredit'+rowCount+'" name="inputCredit" placeholder="3">' +
        '    </div>' +
        '    <div class="form_grade">' +
        '        <label for="inputGrade'+rowCount+'"></label>' +
        '        <input type="text" id="inputGrade'+rowCount+'" name="inputGrade" placeholder="A+" maxlength="2">' +
        '    </div>' +
        '</div>';
    return newRow;
}
function calculateCGA(){
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
            case 'T':
            case 'P':
            case 'W':
            case 'I':
                totalCredits += credits; continue;
            default:
                return '<p>Wrong Grade Input in Row '+(i+1)+'!</p>';
        }
        if(gradeInput.charAt(1) == '+'){
            gradePoint += 0.3;
        }
        else if(gradeInput.charAt(1) == '-'){
            gradePoint -= 0.3;
        }
        else if(gradeInput.charAt(1) != ''){
            continue;
        }
        totalCredits += credits;
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
// function calculateCGA(){
//     while(document.getElementById('CGAResult').hasChildNodes()){
//         document.getElementById('CGAResult').removeChild(document.getElementById('CGAResult').firstChild);
//     };
//     let rowCount = document.getElementsByClassName('calCourseRows').length;
//     let gradedCredits = 0;
//     let totalCredits = 0;
//     let gradePoints = 0.0;
//     let temp = 0.0;
//     for(let i = 0; i < rowCount; i++){
//         var credits = parseInt(document.getElementsByName('inputCredit')[i].value);
//         var grade = document.getElementsByName('inputGrade')[i].value;
//         switch(grade.charAt(0)){
//             case 'A':
//                 temp = 4.0; break;
//             case 'B':
//                 temp = 3.0; break;
//             case 'C':
//                 temp = 2.0; break;
//             case 'D':
//                 temp = 1.0; break;
//             case 'F':
//                 temp = 0.0; break;
//             case 'T':
//             case 'P':
//             case 'W':
//             case 'I':
//                 totalCredits += credits; continue;
//             default:
//                 document.getElementById('CGAResult').innerHTML = '<p>Wrong Grade Input!</p>';
//                 return;
//         }
//         if(grade.charAt(1) == '+'){
//             temp += 0.3;
//         }
//         else if(grade.charAt(1) == '-'){
//             temp -= 0.3;
//         }
//         else if(grade.charAt(1) != ''){
//             continue;
//         }
//         totalCredits += credits;
//         gradedCredits += credits;
//         gradePoints += temp * credits;
//     }
//     if(totalCredits <= 0){
//         document.getElementById('CGAResult').innerHTML = '<p>Credit is 0!</p>';
//         return; 
//     }
//     let CGA = gradePoints / gradedCredits;
//     document.getElementById('CGAResult').innerHTML = '<p>Result:</p>' +
//         '<p>Number of credits: '+number_of_total_credits+'</p>' + 
//         '<p>CGA: '+CGA+'</p>';   
// }