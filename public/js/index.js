function send() {
  var data = collectData();

  console.log(data);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", 'http://127.0.0.1:5000/attrition', true);

  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function() { // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        var data = JSON.parse(this.response);
        $('#myModal').modal()
        var fa = document.getElementById("aiLevel");
        fa.classList = "far fa-3x";
        fa.classList.add(getSatisfactionClass(data.score));
        var progress = document.getElementById("aiProgress");
        progress.classList = "";
        progress.classList.add(getSatisfactionColor(data.score));
        progress.style.width = Math.floor(data.percentage) + '%';
        progress.ariaValuenow = Math.floor(data.percentage);
        progress.innerText = Math.floor(data.percentage) + '%';

        console.log(JSON.parse(this.response));
      }
  }
  xhr.send(JSON.stringify(data));
}

function collectData() {
  return {
    "age":$("#age-input").val(),
    "education":$("#education-input option:selected").text(),
    "jobLevel":$("#job-level-input option:selected").val(),
    "numCompaniesWorked":$("#companies-worked-input").val(),
    "trainingTimesLastYear":$("#trainings-last-year-input").val(),
    "yearsAtCompany":$("#years-company-input").val(),
    "yearsSinceLastPromotion":$("#years-since-last-promotion-input").val(),
    "distanceFromHome":$("#distance-from-home-input").val(),
    "monthlyIncome":$("#salary-input").val(),
    "totalWorkingYears":$("#working-years-input").val()
  }
}

function getSatisfactionColor(level) {
  var className = "";
  switch(level) {
      case 1:
          className = "emo-frown"
          break;
      case 4:
          className = "emo-laugh";
          break;

      case 2:
          className = "emo-meh";
          break;
      case 3:
          className = "emo-grin";
          break;
  }
  return className;
}

 function getSatisfactionClass(level) {
   var className = "";
   switch(level) {
       case 1:
           className = "fa-frown";
           break;
       case 4:
           className = "fa-laugh";
           break;

       case 2:
           className = "fa-meh";
           break;
       case 3:
           className = "fa-grin";
           break;
   }
   return className;
 }


