import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Quiz from "./Quiz"
import Admin from "./Admin/Admin"

const AppRouter = () => (
  <Router>
    <div>
      <Route path="/" exact component={Quiz} />
      <Route path="/admin" component={Admin} />
    </div>
  </Router>
);

export default AppRouter;