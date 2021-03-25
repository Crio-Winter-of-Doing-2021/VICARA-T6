import Login from '../../components/Auth/Login';
import SignUp from '../../components/Auth/SignUp';
import { useParams } from 'react-router-dom';

interface RouterParams {
  state: string;
}

function Auth() {
  const { state }: RouterParams = useParams();

  return (
    <div className="h-screen w-screen flex items-center justify-center md:items-start bg-pink-600 md:bg-white">
      {state === 'login' ? <Login /> : <SignUp />}
    </div>
  );
}

export default Auth;
