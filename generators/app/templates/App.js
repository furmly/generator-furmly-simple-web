import React from "react";
import qs from "query-string";
import { Switch, Route,withRouter } from "react-router-dom";
import { routerMiddleware } from "react-router-redux";
import { createHashHistory } from "history";
import { persistReducer, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage/session";
import {defaultRootReducer} from "<%= component %>";
<%if (usesTheme) { %>
import { ThemeProvider } from "<%= component %>";
import defaultTheme from "./theme";
<% } %> 
import Menu from "./Menu";
import FurmlyControls from "./furmly";
import "./app.scss";

const Process = FurmlyControls.PROCESS;
let persistor;
class App extends React.PureComponent {
  completed=()=>{
    alert("we are done!");
    window.location.hash = "";
  }
  render() {
    return (
          <div id="main">
           <%if (usesTheme) { %> <ThemeProvider theme={defaultTheme}> <% } %>
            <div className={"wrapper"}>
            <Menu openProcess={this.props.openProcess} />
               <div className="content"> <Switch>
                  <Route
                    path={"/:processId"}
                    component={({ match }) => {
                      const fetchParams = qs.parse(this.props.location.search);
                      const currentStep =
                        (fetchParams && fetchParams.currentStep) || 0;
                      return (
                        <Process
                          id={match.params.processId}
                          currentStep={currentStep}
                          fetchParams={fetchParams}
                          processCompleted={this.completed}
                        />
                      );}}
                  />
              <Route
                path={"/"}
                component={() => <div className="welcome">
                <h1>Hello world! 😁</h1>
                <h3>Please select a sample form from the menu above.</h3>
              </div>}
              />
              </Switch></div>
            </div>
           <%if (usesTheme){ %> </ThemeProvider> <% } %>
          </div>
    );
  }
}



const showMessage = store => next => action => {
  if (action.type == "SHOW_MESSAGE") {
    window.alert(action.message);
    return;
  }
  next(action);
};
App.pushVisible = true;
const persistConfig = {
  key: "root",
  storage
};
const ConfiguredApp = withRouter(
  FurmlyControls.createPage(
    App,
    { Furmly: { path: "/:id", routeParams: ["id"] } },
    {
      extraMiddlewares: [routerMiddleware(createHashHistory()), showMessage],
      rootReducer: persistReducer(persistConfig, defaultRootReducer),
      storeEnhancer: store => (persistor = persistStore(store))
    }
  )
);

ConfiguredApp.pushVisible = true;
export default props => (
  <PersistGate persistor={persistor} loading={<div>Loading</div>}>
    <ConfiguredApp {...props} />
  </PersistGate>
);
