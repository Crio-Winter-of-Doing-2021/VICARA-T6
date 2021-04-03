import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Auth from '../pages/Auth';
import Search from '../pages/Search';
import DriveHome from '../pages/DriveHome';
import ProtectedRoute from './ProtectedRoute';

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
        <ProtectedRoute path="/search" component={Search} />
        <ProtectedRoute path="/:id" component={DriveHome} />
      </Switch>
    </BrowserRouter>
  );
}
