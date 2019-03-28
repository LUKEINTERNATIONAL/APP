var apiProtocol = sessionStorage.apiProtocol;
var apiURL = sessionStorage.apiURL;
var apiPort = sessionStorage.apiPort;
var patient_id = sessionStorage.patientID;
var patient_age = null;
var age = null;
var ageInMonths = null;
var birthdate;
var dateCreated;
var patientBirthdateEstimated;
var patientAge = 0;
var patientGender = "";

function getDemographics(patient_id) {
    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/patients/" + patient_id;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            var obj = JSON.parse(this.responseText);
            obj = obj["person"];
            var names = obj["names"][0];
            sessionStorage.family_name = names["family_name"];
            sessionStorage.given_name = names["given_name"];
            sessionStorage.patientGender = obj["gender"];
            sessionStorage.birthdate = obj["birthdate"];
            sessionStorage.date_created = obj["date_created"];
            birthdate = new Date(obj["birthdate"]);
            dateCreated = new Date(obj["date_created"]);
            patientBirthdateEstimated = obj["birthdate_estimated"];

            var roundedAge = Math.round(moment().diff(obj["birthdate"], 'years', true));
            ageInMonths = roundedAge * 12
            sessionStorage.patientAge = roundedAge;
            patient_age = roundedAge;
            age = roundedAge;
            sessionStorage.patientGender = obj["gender"];
            if (obj["gender"] == "F"){
                patientGender = "FEMALE";
            } else{
                patientGender = "MALE";
            }

            sessionStorage.patientDOB = moment(obj["birthdate"]).format("DD/MMM/YYYY");
            //sessionStorage.sessionDate = moment().format("YYYY-MM-DD");
            sessionStorage.currentWeight = 0;
            sessionStorage.previousWeight = 0;
            sessionStorage.currentHeight = 0;
        }
    };
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}
