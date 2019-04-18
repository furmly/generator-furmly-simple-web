const qs = require("query-string");
module.exports = {
  waitingProcessors: [],
  baseUrl: "",
  preDispatch: function(action) {
    return action;
  },
  notifyStepAdvance: function(dispatch, state, params) {
    let hash_query = location.hash.split("?");
    var query = qs.parse(hash_query[1] || "");
    query.currentStep = params.params.currentStep;
    window.location.hash = hash_query + "?" + qs.stringify(query);
  },
  preRefreshToken: function(action, state) {
    return action;
  }
};
