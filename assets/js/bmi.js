function getBMIResult(gender, age, bmindex) {
    var url = '/public/bmi.json';
    if (age < 5 && age > 0) {
        sessionStorage.bmiResult = 'Use MUAC to calculate nutrition status';
        sessionStorage.bmiColor = 'red';
    }else {
        if (age > 18) {
                age = "adult";
            }
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        var results = JSON.parse(this.responseText);
                        var bounds = Object.keys(results[gender][0][age]);
                        var dataset  =results[gender][0][age];
                        bounds.forEach( function(bound) {
                            buildBounds(bound, dataset, bmindex, results);
                        });
                    }
                }
            };
            try {
                req.open('GET', url, false);
                req.setRequestHeader('Authorization', sessionStorage.getItem('authorization'));
                req.send(null);
            } catch (e) {
            }
    }
    
}

function buildBounds(bounds, dataset, bmindex, results) {
    if(bounds.indexOf("-") >= 0){
        var boundsArray = bounds.split("-");
        if (bmindex >= parseFloat(boundsArray[0]) && bmindex <= parseFloat(boundsArray[1])) {
            sessionStorage.bmiResult = dataset[bounds];
            sessionStorage.bmiColor = results.colors[dataset[bounds]];
        }
    }else if(bounds.indexOf("<") >= 0) {
        var lessThanBounds = bounds.replace("<", "");
        if(bmindex < parseFloat(lessThanBounds)) {
            sessionStorage.bmiColor = results.colors[dataset[bounds]];
            sessionStorage.bmiResult = dataset[bounds];
        }
    }else if(bounds.indexOf(">=") >= 0) {
        var greaterThanBounds = bounds.replace(">=", "");
        if(bmindex >= parseFloat(greaterThanBounds)) {
            sessionStorage.bmiResult = dataset[bounds];
            sessionStorage.bmiColor = results.colors[dataset[bounds]];
        }
    }
    
}
