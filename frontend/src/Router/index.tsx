import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Auth from '../pages/Auth/index';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/auth">
          <Auth />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
