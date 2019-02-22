var Encounter = function () {
  var apiRoot =  `${sessionStorage.apiProtocol}://${sessionStorage.apiURL}:${sessionStorage.apiPort}/api/v1`
  var user = null

  function init (data) {
    user = data
  }

  function create (data = {}) {
    fetch (`${apiRoot}/encounters`, {
      method: 'POST',
      headers: {
        'Authorization': sessionStorage.authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data.params)
    })
      .then((response) => {
        if (response.status === 201) {
          response.json()
            .then((payload) => {
              data.success(payload)
            })
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