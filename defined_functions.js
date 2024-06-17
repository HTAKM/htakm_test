function add_rows(){
    var number_of_rows = document.getElementsByClassName('course_rows_given').length+1;
    document.getElementsByClassName('courses_given')[0].innerHTML += 
        '<div class="course_rows_given">' + 
        '    <div class="form_course">' +
        '        <label for="inputCourse'+number_of_rows+'"></label>' +
        '        <input type="text" id="inputCourse'+number_of_rows+'" name="inputCourse" placeholder="COMP 1021">' +
        '    </div>' +
        '    <div class="form_credit">' +
        '        <label for="inputCredit'+number_of_rows+'"></label>' +
        '        <input type="number" id="inputCredit'+number_of_rows+'" name="inputCredit" placeholder="3">' +
        '    </div>' +
        '    <div class="form_grade">' +
        '        <label for="inputGrade'+number_of_rows+'"></label>' +
        '        <input type="text" id="inputGrade'+number_of_rows+'" name="inputGrade" placeholder="A+" maxlength="2">' +
        '    </div>' +
        '</div>';
}
function delete_rows(){
    var number_of_rows = document.getElementsByClassName('course_rows_given').length;
    if(number_of_rows > 1){
        document.getElementsByClassName('courses_given')[0].removeChild(document.getElementsByClassName('courses_given')[0].lastChild);
    }
}
function calculate_CGA(){
    while(document.getElementById('result_of_cga').hasChildNodes()){
        document.getElementById('result_of_cga').removeChild(document.getElementById('result_of_cga').firstChild);
    };
    let number_of_rows = document.getElementsByClassName('course_rows_given').length;
    let number_of_graded_credits = 0;
    let number_of_total_credits = 0;
    let number_of_grade_points = 0.0;
    let temp = 0.0;
    for(let i = 0; i < number_of_rows; i++){
        var credits = document.getElementsByName('inputCredit')[i].value;
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
                number_of_total_credits += credits; continue;
            default:
                document.getElementById('result_of_cga').innerHTML = '<p>Wrong Grade Input!</p>';
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
        number_of_total_credits += credits;
        number_of_graded_credits += credits;
        number_of_grade_points += temp * credits;
    }
    if(number_of_credits <= 0){
        document.getElementById('result_of_cga').innerHTML = '<p>Credit is 0!</p>';
        return; 
    }
    let CGA = number_of_grade_points / number_of_graded_credits;
    document.getElementById('result_of_cga').innerHTML = '<p>Result:</p>' +
        '<p>Number of credits: '+number_of_total_credits+'</p>' + 
        '<p>CGA: '+CGA+'</p>';   
}