import { useEffect, useState } from 'react';
import Axios from '../config/axios';
import { Redirect, Route } from 'react-router-dom';
import Loader from 'react-loader-spinner';

export default function ProtectedRoute({ component: Component, ...rest }: any) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const { data } = await Axios.get('/current_user');

        if (data.currentUser === null) {
          setAuthenticated(false);
        } else {
          setAuthenticated(true);
        }
      } catch (error) {
        setAuthenticated(false);
      }

      setLoading(false);
    }

    getCurrentUser();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Loader type="Rings" color="#60a5fa" height={100} width={100} />
      </div>
    );
  }

  return (
    <Route
      {...rest}
      render={() => {
        return authenticated ? <Component /> : <Redirect to="/auth/login" />;
      }}
    />
  );
}
