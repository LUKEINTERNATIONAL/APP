function hideKBD() {
    
    try {
      var keyboard = document.getElementById("kbd");
      var main = document.getElementsByClassName("modal-content")[0];
      main.removeChild(keyboard);
    }catch(i) {
      return;
    }
  }

  var focusInput = document.getElementById("lab-tests");

  function showKBD(returnString, functionName) {
    var keyboard = document.createElement("div");
    keyboard.setAttribute("id","kbd");
    var main = document.getElementsByClassName("modal-content")[0];
    var styles = "left:50px;top: 50px;";
    keyboard.setAttribute("style", styles);
    main.appendChild(keyboard);
    keyboardKeys(returnString, functionName);
  }

  function keyboardKeys(returnString, functionName) {

    var keypress = [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      ["q","w","e","r","t","y","u","i","o","p"],
      ["a","s","d","f","g","h","j","k","l","Del."],
      ["z","x","c","v","b","n","m", "Next", "close"]
    ];

    var table = document.createElement("div");
    table.setAttribute("class","keyboards-table");
    for(var i = 0 ; i < keypress.length ; i++){
      var row = document.createElement("div")
      row.setAttribute("class","keyboards-table-row");
      table.appendChild(row);

      for(var x = 0 ; x < keypress[i].length ; x++){
        var cell = document.createElement("div")
        cell.setAttribute("class","keyboards-table-cell");
        row.appendChild(cell);
        var span = document.createElement("span")
        span.addEventListener("mousedown", function() {
          keyPressed(this, returnString, functionName);
        })
        if(keypress[i][x] == 'NEXT' || keypress[i][x] == 'LOGIN') {
          span.setAttribute("class","keyboard-span green_btn");
          span.addEventListener("mousedown", function() {
            keyPressed(this);
          })
        } else {
          span.setAttribute("class","keyboards-span");
        }

        span.innerHTML = keypress[i][x];
        cell.appendChild(span);

      }
    }

    var keyboard = document.getElementById("kbd");
    keyboard.appendChild(table);
  }

  function keyPressed(e, returnString, functionName) {
    var inputBox = document.getElementById("lab-tests");
    try{

      if(e.innerHTML.match(/Del/i)){
        inputBox.value = inputBox.value.substring(0, inputBox.value.length - 1);
      }else if(e.innerHTML.match(/space/i)){
      inputBox.value += "+";
    }else if(e.innerHTML.match(/close/i)){
      document.getElementById("myModal").style.display = "none";
      var e = document.getElementById("nav-results");
      buildPage(e)
    }
    else{

        inputBox.value += e.innerHTML;
        functionName(returnString+inputBox.value );
      }

    }catch(x) { }

  }
