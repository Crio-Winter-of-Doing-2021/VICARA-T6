import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Axios from '../../config/axios';
import './index.css';

interface fields {
  email?: string;
  password?: string;
}

function Login() {
  const history = useHistory();
  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    watch,
    errors
  } = useForm();

  const onSubmit = async (values: fields) => {
    console.log(values);

    try {
      await Axios.post('/users/signin', values);

      await Axios.get('/browse/rootdir').then((res) => {
        const id = res.data.id;
        history.push(`/${id}`);
      });
    } catch (error) {
      console.log(error);

      setError('custom', {
        type: 'manual',
        message: error?.response?.data?.err
      });
    }
  };

  return (
    <div className="xl:w-8/12 lg:w-5/12 md:w-4/12 sm:w-full px-10 pb-10 pt-3 md:shadow-none md:p-6 rounded-md flex dark:text-white dark:bg-gray-800 bg-white shadow-lg flex-col items-center justify-center">
      <div className="pt-6 pb-3">
        <div className="flex-shrink-0 flex items-center mr-auto font-semibold sm:ml-auto text-2xl">
          Vicara
        </div>
      </div>
      <p className="text-sm">Login to continue</p>
      <div className="my-3 min-w-full">
        <form className="min-w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-3 flex flex-col">
            <label
              className={`form-label cursor-text text-gray-500 ${
                watch('email') && 'form-label-active text-sm'
              } ${errors.email && 'text-red-400'}`}
            >
              Email address
            </label>
            <input
              className={`rounded-sm border py-3 px-3 text-lg text-grey-darkest focus:outline-none ${
                errors.email &&
                'border-red-400 focus:border-red-600 focus:border-4'
              }`}
              type="text"
              name="email"
              ref={register({
                required: 'Required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
          </div>

          <div className="mb-5 flex flex-col">
            <label
              className={`form-label cursor-text text-gray-500 ${
                watch('password') && 'form-label-active text-sm'
              } ${errors.password && 'text-red-400'}`}
            >
              Password
            </label>
            <input
              className={`rounded-sm border py-3 px-3 text-lg text-grey-darkest focus:outline-none ${
                errors.password &&
                'border-red-400 focus:border-red-600 focus:border-4'
              }`}
              type="password"
              name="password"
              ref={register({
                required: 'Required'
              })}
            />
          </div>
          <div className="mt-2 text-red-500">
            {errors.custom && errors?.custom?.message}
          </div>

          <div className="my-5 flex flex-col">
            <input
              type="submit"
              className="py-3.5 bg-pink-600 text-white rounded-sm cursor-pointer hover:bg-pink-700 duration-100"
              onClick={() => clearErrors()}
            />
          </div>
        </form>
        <label className="text-sm text-gray-500">
          Please enable 3rd party cookies to login
        </label>
        <div className="mt-2" />
        <div>
          <p className="text-s">
            Don&apos;t have an account?{' '}
            <Link to="/auth/signup" className="text-blue-700">
              Create One
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
