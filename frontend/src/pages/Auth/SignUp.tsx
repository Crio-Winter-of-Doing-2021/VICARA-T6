import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import logo from '../../assets/logo.svg';
import './index.css';

interface fields {
  email?: string;
  password?: string;
}

function SignUp() {
  const { handleSubmit, register, watch } = useForm();
  console.log(watch('password'), watch('password')?.length);

  const onSubmit = (values: fields) => console.log(values);

  return (
    <div className="xl:w-8/12 lg:w-5/12 md:w-4/12 sm:w-full px-10 pb-10 pt-3 md:shadow-none md:p-6 rounded-md flex dark:text-white dark:bg-gray-800 bg-white shadow-lg flex-col items-center justify-center">
      <div className="pt-6 pb-3">
        <img className="h-14 w-auto" src={logo} />
      </div>
      <h1 className="font-sans my-4 text-2xl">Welcome</h1>
      <p className="text-sm">Sign Up to continue to FDrive</p>
      <div className="my-3 min-w-full">
        <form className="min-w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-3 flex flex-col">
            <label
              className={`form-label cursor-text text-gray-500 ${
                watch('email') && 'form-label-active text-sm'
              }`}
            >
              Email address
            </label>
            <input
              className="rounded-sm border py-3 px-3 text-lg text-grey-darkest"
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
              }`}
            >
              Password
            </label>
            <input
              className="rounded-sm border py-3 px-3 text-lg text-grey-darkest"
              type="text"
              name="password"
              ref={register({
                required: 'Required',
                pattern: {
                  value: /((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/i,
                  message: 'Not a strong password'
                }
              })}
            />
          </div>
          <div className="border border-grey-darkest py-2 px-4">
            <h3 className="text-sm">Your password must contain:</h3>
            <div>
              <div
                className={`${
                  watch('password') !== undefined &&
                  watch('password')?.length !== 0 &&
                  (watch('password').length >= 8
                    ? 'text-green-400'
                    : 'text-red-400')
                }`}
              >
                <input type="checkbox" />
                <span className="pl-2 text-sm">At least 8 characters</span>
              </div>
              <div
                className={`${
                  watch('password') !== undefined &&
                  watch('password')?.length !== 0 &&
                  (/\d/.test(watch('password'))
                    ? 'text-green-400'
                    : 'text-red-400')
                }`}
              >
                <input type="checkbox" />
                <span className="pl-2 text-sm">Numbers</span>
              </div>
            </div>
          </div>
          <div className="my-5 flex flex-col">
            <input
              type="submit"
              className="py-3.5 bg-pink-600 text-white rounded-sm"
            />
          </div>
        </form>
        <div>
          <p className="text-sm">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-blue-700">
              Login in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;