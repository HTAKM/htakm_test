function add_rows(){
    var number_of_rows = document.getElementsByClassName('course_rows_given').length+1;
    var temp = document.createElement('div');
    temp.setAttribute("class","course_rows_given");
    var temp1 = document.createElement('div');
    temp1.setAttribute("class","form_course");
    var input = document.createElement('input');
    input.setAttribute("type","text");
    input.setAttribute("id","inputCourse"+number_of_rows);
    temp1.appendChild(input);
    temp.appendChild(temp1);
    temp1 = document.createElement('div');
    temp1.setAttribute("class","form_credit");
    input = document.createElement('input');
    input.setAttribute("type","number");
    input.setAttribute("id","inputCredit"+number_of_rows);
    temp1.appendChild(input);
    temp.appendChild(temp1);
    temp1 = document.createElement('div');
    temp1.setAttribute("class","form_grade");
    input = document.createElement('input');
    input.setAttribute("type","text");
    input.setAttribute("id","inputGrade"+number_of_rows);
    temp1.appendChild(input);
    temp.appendChild(temp1);
    document.getElementsByClassName('courses_given').appendChild(temp);
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