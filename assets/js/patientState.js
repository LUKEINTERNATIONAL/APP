function getProgramWorkflowStates() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var apiPath = apiProtocol + '://' + apiURL + ':' + apiPort + '/api/v1/programs/' + options.programId + '/workflows';
  GET({
    url: apiPath,
    async: true,
    headers: {
      'Authorization': options.authToken
    }
  }, {}, function (data) {
    options.success(data);
  }, function (error) {
    options.error(error);
  });
}

function getStateIdByName() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  getProgramWorkflowStates({
    programId: sessionStorage.getItem('programID'),
    authToken: sessionStorage.getItem('authorization'),
    success: function success(data) {
      var stateId = data[0].states.filter(function (state) {
        return state.concept.concept_names.every(function (concept_name) {
          return concept_name.name === options.stateName;
        });
      })[0].program_workflow_state_id;
      if (!stateId) {
        options.error(new Error('getStateIdByName: The passed state with name (' + options.stateName + '), does not exist.'));
      } else {
        options.success(stateId);
      }
    },
    error: function error(_error) {
      options.error(_error);
    }
  });
}

function createPatientState() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var apiPath = apiProtocol + '://' + apiURL + ':' + apiPort + '/api/v1/programs/' + options.programId + '/patients/' + options.patientId + '/states';
  getStateIdByName({
    stateName: options.stateName,
    success: function success(stateId) {
      POST({
        url: apiPath,
        async: true,
        headers: {
          'Authorization': options.authToken,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }, {
        state: stateId
      }, function (data) {
        options.success(data);
      }, function (error) {
        options.error(error);
      });
    },
    error: function error(_error2) {
      options.error(_error2);
    }
  });
}