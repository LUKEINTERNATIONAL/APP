var Observation = function () {
  var apiRoot =  `${sessionStorage.apiProtocol}://${sessionStorage.apiURL}:${sessionStorage.apiPort}/api/v1`
  var user = null

  function init (data) {
    user = data
  }

  function create (data = {}) {
    fetch (`${apiRoot}/observations`, {
      method: 'POST',
      headers: {
        'Authorization': sessionStorage.authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data.params)
    })
      .then((response) => {
        if (response.status === 201) {
          data.success(response)
        } else {
          data.fail(response)
        }
      })
      .catch((error) => {
        data.fail(error)
      })
  }

  return {
    create
  }
}()