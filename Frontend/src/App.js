import { BrowserRouter, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        {/* <Route exact path="/login">
          <Login />
        </Route> */}
        <Route path="/register">
          <Dashboard />
        </Route>
        <Route path="/dashboard" exact>
          <Navbar />
          <Register />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
