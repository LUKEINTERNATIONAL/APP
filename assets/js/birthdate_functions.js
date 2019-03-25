
function displayFormatedBirthdate(dob, est){
  var birthdate = moment(dob).format('DD/MMM/YYYY');
  var estimated = parseInt(est);
  var year      = moment(dob).format('YYYY');
  var month     = moment(birthdate).format('MM');
  var day       = moment(birthdate).format('DD');

  if(estimated == 1){
    if(month == 7 && day == 1){
      return ("??/???/" + year);
    }else if(day == 15){
      return ("??/" + moment(dob).format('MMM/YYYY'));
    }else{
      return birthdate;
    }
  }
  return birthdate;
}



function calculate_age(dob) {
  var birthdate = new Date(dob);
  var today = new Date();

  var patient_age = (today.getFullYear() - birthdate.getFullYear()) + ((today.getMonth() - birthdate.getMonth()) + ((today.getDay() - birthdate.getDay()) < 0 ? -1 : 0) < 0 ? -1 : 0);

  return patient_age;
}


