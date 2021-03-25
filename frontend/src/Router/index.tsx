import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Auth from '../pages/Auth/index';
import DriveHome from '../pages/DriveHome/index';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/auth/:state">
          <Auth />
        </Route>
        <Route path="/:id">
          <DriveHome />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
