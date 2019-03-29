var functiontobecalled = null;
var apiURL = sessionStorage.getItem("apiURL");
var apiPort = sessionStorage.getItem("apiPort");
var apiProtocol = sessionStorage.getItem("apiProtocol");


function getParameters(aUrl){

    var url = apiProtocol + '://'+apiURL+':'+apiPort+'/api/v1' + aUrl;
    
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
     
        if (this.readyState == 4 && this.status == 200) {
            functiontobecalled = eval(functiontobecalled);
            functiontobecalled(this.responseText);
        }    
    };
    try {
        req.open('GET', url, true);
        req.setRequestHeader('Authorization',sessionStorage.getItem("authorization"));
        req.send(null);
    } catch (e) {
        
    } 
}