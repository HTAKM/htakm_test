function add_rows(){
    var number_of_rows = document.getElementsByClassName('course_rows_given').length+1;
    document.getElementsByClassName('course_given').innerHTML += '<div class="course_rows_given">' +
        '   <div class="form_course">' + 
        '       <input type="text" id="inputCourse'+number_of_rows+'">' + 
        '   </div>' +
        '   <div class="form_credit">' + 
        '       <input type="number" id="inputCredit'+number_of_rows+'">' + 
        '   </div>' +
        '   <div class="form_grade">' + 
        '       <input type="text" id=inputGrade'+number_of_rows+'" maxlength="2">' + 
        '   </div>' +
        '</div>';
}
function calculate_CGA(){
    var number_of_rows = document.getElementsByClassName('coures_rows_given').length;
    var number_of_credits = 0;
    var number_of_grade_points = 0.0;
    var temp = 0.0;
    for(let i = 1; i <= number_of_rows; i++){
        switch(document.getElementById('inputGrade'+i+'').charAt()){
            case A:
                temp = 4.0; break;
            case B:
                temp = 3.0; break;
            case C:
                temp = 2.0; break;
            case D:
                temp = 1.0; break;
            case F:
                temp = 0.0; break;
            default:
                document.getElementById('result_of_cga').innerHTML = '<p>Wrong Grade Input!</p>';
                return;
        }
        if(document.getElementById('inputGrade'+i+'').charAt(1) == '+'){
            temp += 0.3;
        }
        else if(document.getElementById('inputGrade'+i+'').charAt(1) == '-'){
            temp -= 0.3;
        }
        number_of_credits += document.getElementById('inputCredit'+i+'');
        number_of_grade_points += temp * document.getElementById('inputCredit'+i+'');
    }
    var CGA = number_of_grade_points / number_of_credits;
    document.getElementsById('result_of_cga').innerHTML = '<p>Result:</p>' +
        '<p>Number of credits: '+number_of_credits+'</p>' + 
        '<p>CGA: '+CGA+'</p>';   
}