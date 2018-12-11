var assigned_arv_number = [];

var site_prefix = "";
function getSitePrefix(){
    var property_name = "site_prefix";
    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/global_properties?property=" + property_name;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            try{
                site_prefix = JSON.parse(this.responseText)["site_prefix"];
            } catch(e){

            }
        }
    };

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}

getSitePrefix();

function getSuggestedARVNumber(){
    var inputElement = $('tt_page_art_number').getElementsByTagName("input")[0]
    var prefix = document.createElement("span")
    var style = document.createAttribute("style")
    style.value = "position: absolute; z-index: 100; left: 47px; font-size: 44px;"
    prefix.setAttributeNode(style)
    inputElement.setAttribute("style","text-align:right;width:924px;")
    prefix.innerHTML = site_prefix;
    inputElement.parentNode.insertBefore(prefix, inputElement)
    style.value+= 'left:35px;'
    prefix.setAttributeNode(style)

    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/programs/1/next_available_arv_number";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            var suggested_arv_number = JSON.parse(this.responseText)["arv_number"];
            var suggested_arv_number = suggested_arv_number.replace( /^\D+/g, '');
            inputElement.value = suggested_arv_number
        }
    };

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}

function changeNextButtonToValidateARVNumber(){
    __$('nextButton').onmousedown = function(){
        value = __$('touchscreenInput' + tstCurrentPage).value;
        var arv_number = site_prefix + "-ARV-" + value;
        var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/programs/1/lookup_arv_number/" + arv_number;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
                var exists = JSON.parse(this.responseText)["exists"];
                if (exists){
                    showMessage("ARV number already exists")
                } else{
                    submitHIVreception();
                }

            }
        };

        xhttp.open("GET", url, true);
        xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
        xhttp.setRequestHeader('Content-type', "application/json");
        xhttp.send();
    }
}

var patient_has_art_number = false;
function getPatientIdentifiers(){
    var url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/patients/" + sessionStorage.patientID;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 201 || this.status == 200)) {
            var patient_identifiers = JSON.parse(this.responseText)["patient_identifiers"];
            for (var i=0; i<=patient_identifiers.length - 1; i++){
                var identifier_type = patient_identifiers[i].type;
                if (identifier_type.name.match(/ARV/i)){
                    patient_has_art_number = true;
                }
            }
        }
    };

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('Authorization', sessionStorage.getItem("authorization"));
    xhttp.setRequestHeader('Content-type', "application/json");
    xhttp.send();
}

getPatientIdentifiers();



