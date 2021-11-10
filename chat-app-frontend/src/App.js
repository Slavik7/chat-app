import AppWindow from "./components/AppWindow";
import LoginWindow from "./components/LoginWindow";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

function App() {
  const user = useSelector((state) => state.user);
  return (
    <div className="app">
      <div className="app-container">
        <Switch>
          <Route path="/" exact>
            {!user.active ? <Redirect to="/login" /> : <Redirect to="/app" />}
          </Route>
          <Route path="/login">{<LoginWindow user={user} />}</Route>
          <Route path="/app">{<AppWindow user={user} />}</Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
