function fetchArgumentFromUrlString(argumentName) {
  var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : location.href;

  var urlToSearch = new URL(url);
  var argument = urlToSearch.searchParams.get(argumentName);
  return argument;
}

function POST(config) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var successCallback = arguments[2];
  var failureCallback = arguments[3];

  var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 201) {
      successCallback(JSON.parse(request.responseText), request.status);
    } else if (request.readyState === 4 && request.status === 204) {
      successCallback({}, request.status);
    } else if (request.readyState === 4 && request.status >= 400) {
      failureCallback(request.responseText, request.status);
    }
  };

  request.open('POST', config.url, config.async);
  Object.keys(config.headers).forEach(function (key) {
    request.setRequestHeader(key, config.headers[key]);
  });

  request.send(encodeURI(buildParametersString(data)));
}

function GET(config) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var successCallback = arguments[2];
  var failureCallback = arguments[3];

  var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      successCallback(JSON.parse(request.responseText), request.status);
    } else if (request.readyState === 4 && request.status >= 400) {
      failureCallback(request.responseText, request.status);
    }
  };

  if (Object.keys(data).length < 1) {
    request.open('GET', config.url, config.async);
  } else {
    request.open('GET', config.url + ('?' + encodeURI(buildParametersString(data))), config.async);
  }

  Object.keys(config.headers).forEach(function (key) {
    request.setRequestHeader(key, config.headers[key]);
  });

  request.send();
}

function buildParametersString(params) {
  var paramsString = '';
  Object.keys(params).forEach(function (key, index, array) {
    paramsString += key + '=' + params[key];
    if (index < array.length - 1) {
      paramsString += '&';
    }
  });
  return paramsString;
}

function redirectToUrl (url) {
  document.location = url
}