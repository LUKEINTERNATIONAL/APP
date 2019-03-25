function showPrompt() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var prompt = document.createElement('div');
  prompt.setAttribute('id', 'dankPrompt');
  prompt.style = 'background-color: white;font-size: 1.5em;font-family: Ubuntu;position: fixed;width: 50%;height: auto;top: 25%;left: 25%;padding: 2%;' + 'border-radius: 4px;z-index: 9000;';

  var promptMessage = document.createElement('h3');
  promptMessage.innerText = options.message;
  promptMessage.innerHTML += '<hr />';
  prompt.appendChild(promptMessage);

  prompt.appendChild(createToolkitButton({
    text: 'Yes',
    listeners: [{
      event: 'click',
      handler: options.yesCallback
    }],
    style: 'color: white; float: left'
  }));

  prompt.appendChild(createToolkitButton({
    text: 'No',
    listeners: [{
      event: 'click',
      handler: options.noCallback
    }],
    style: 'color: white; float: right'
  }));

  document.body.appendChild(createScreenOverlay({
    color: 'black',
    opacity: .8
  }));
  document.body.appendChild(prompt);
}

function createScreenOverlay() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var overlay = document.createElement('div');
  overlay.setAttribute('id', 'dankOverlay');
  overlay.style = 'background-color: ' + options.color + ';\nopacity: ' + options.opacity + ';position: fixed;width: 100%;height: 100%;top: 0;bottom: 0;left: 0;right: 0;z-index: 9000;';
  return overlay;
}

function removePrompt() {
  document.body.removeChild(document.getElementById('dankOverlay'));
  document.body.removeChild(document.getElementById('dankPrompt'));
}

function createToolkitButton() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var button = document.createElement('button');
  button.innerHTML += '<span>' + options.text + '</span>';

  if (options.attributes) {
    options.attributes.forEach(function (attribute) {
      button.setAttribute(attribute.name, attribute.value);
    });
  }

  if (options.listeners) {
    options.listeners.forEach(function (listener) {
      button.addEventListener(listener.event, listener.handler);
    });
  }

  if (options.style) {
    button.style = options.style;
  }

  return button;
}