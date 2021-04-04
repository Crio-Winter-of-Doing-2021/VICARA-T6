import { useQuery } from 'react-query';
import { Redirect } from 'react-router-dom';
import Loader from 'react-loader-spinner';

import Axios from '../config/axios';
import BaseLayout from '../components/BaseLayout';

function useAuth() {
  return useQuery('user', async () => {
    try {
      const { data } = await Axios.get('/users/currentuser');
      console.log(data);

      return data;
    } catch (error) {
      return { error: error?.response?.data?.err };
    }
  });
}

function Login() {
  const { data, status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Loader type="Rings" color="#60a5fa" height={100} width={100} />
      </div>
    );
  }

  if (data.error) {
    return (
      <div>
        <Redirect to="/auth/login" />
      </div>
    );
  }

  return (
    <div>
      <Redirect to={`/${data?.currentUser?.id}`} />
    </div>
  );
}

function Home() {
  return (
    <BaseLayout>
      <Login />
    </BaseLayout>
  );
}

export default Home;
