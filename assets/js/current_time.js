var apiProtocol = sessionStorage.apiProtocol;
var apiURL = sessionStorage.apiURL;
var apiPort = sessionStorage.apiPort;
var current_time_url = apiProtocol + "://" + apiURL + ":" + apiPort + "/api/v1/current_time/";
var connectionInterval;
var current_time = "";
function currentTime() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', current_time_url, true);
    xhr.send();

    xhr.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 304) {
                var responseText = JSON.parse(this.responseText);
                var time = responseText["time"].split(":");
                var hour = time[0];
                var minutes = time[1];
                jQuery(".hours").html(hour)
                jQuery(".minutes").html(minutes)
            }
        }
    }
}
currentTime();
var control = false;
function animateSeparator(){
    if (control){
        jQuery(".separator").html(":")
        control = false
    } else {
        jQuery(".separator").html("&nbsp");
        control = true;
    }

}

//window.setInterval("animateSeparator();", 60000);

//connectionInterval = window.setInterval("currentTime();", 60000);

