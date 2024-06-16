function add_rows(){
    var temp = document.createElement('div');
    temp.setAttribute("class", "course_rows_given");
    var temp1 = document.createElement('div');
    temp1.setAttribute("class", "form_course");
    var input = document.createElement('input');
    input.setAttribute("type", "text");
    input.setAttribute("name", "inputCourse");
    temp1.appendChild(input);
    temp.appendChild(temp1);
    temp1 = document.createElement('div');
    temp1.setAttribute("class", "form_credit");
    input = document.createElement('input');
    input.setAttribute("type", "number");
    input.setAttribute("name", "inputCredit");
    temp1.appendChild(input);
    temp.appendChild(temp1);
    temp1 = document.createElement('div');
    temp1.setAttribute("class", "form_grade");
    input = document.createElement('input');
    input.setAttribute("type", "text");
    input.setAttribute("name", "inputGrade");
    temp1.appendChild(input);
    temp.appendChild(temp1);
    document.getElementsByClassName('courses_given')[0].appendChild(temp);
}
function calculate_CGA(){
    while(document.getElementById('result_of_cga').hasChildNodes()){
        document.getElementById('result_of_cga').removeChild(document.getElementById('result_of_cga').firstChild);
    };
    var number_of_rows = document.getElementsByClassName('coures_rows_given').length;
    var number_of_credits = 0;
    var number_of_grade_points = 0.0;
    var temp = 0.0;
    for(var i = 0; i < number_of_rows; i++){
        switch(document.getElementsByName('inputGrade')[i].value.charAt(0)){
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
            default:
                document.getElementById('result_of_cga').innerHTML = '<p>Wrong Grade Input!</p>';
                return;
        }
        if(document.getElementsByName('inputGrade')[i].value.charAt(1) == '+'){
            temp += 0.3;
        }
        else if(document.getElementsByName('inputGrade')[i].value.charAt(1) == '-'){
            temp -= 0.3;
        }
        number_of_credits += document.getElementsByName('inputCredit')[i].value;
        number_of_grade_points += temp * document.getElementsByName('inputCredit')[i].value;
    }
    if(number_of_credits > 0){
        var CGA = number_of_grade_points / number_of_credits;
    }
    else{
        var temp1 = document.createElement('p');
        temp1.appendChild(document.createTextNode("Credit is 0!"));
        document.getElementById('result_of_cga').appendChild(temp1);
        return; 
    }
    document.getElementsById('result_of_cga').innerHTML = '<p>Result:</p>' +
        '<p>Number of credits: '+number_of_credits+'</p>' + 
        '<p>CGA: '+CGA+'</p>';   
}