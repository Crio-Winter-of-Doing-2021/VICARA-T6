import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Axios from '../../config/axios';

interface fields {
  email?: string;
  password?: string;
}

function SignUp() {
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
      await Axios.post('/users/signup', values);

      await Axios.get('/browse/rootdir').then((res) => {
        const id = res.data.id;
        history.push(`/${id}`);
      });
    } catch (error) {
      setError('custom', {
        type: 'manual',
        message: error.response.data.err
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
      <p className="text-sm">Sign Up to continue</p>
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
              className={`rounded-sm border py-3 px-3 text-lg text-grey-darkest ${
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
              }`}
            >
              Password
            </label>
            <input
              className={`rounded-sm border py-3 px-3 text-lg text-grey-darkest ${
                errors.password &&
                'border-red-400 focus:border-red-600 focus:border-4'
              }`}
              type="password"
              name="password"
              ref={register({ required: 'Required' })}
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
                <input
                  type="checkbox"
                  checked={watch('password')?.length >= 8}
                  className="form-checkbox rounded-lg text-green-500"
                  readOnly
                />
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
                <input
                  type="checkbox"
                  checked={
                    !!(
                      watch('password')?.length !== 0 &&
                      /\d/.test(watch('password'))
                    )
                  }
                  className="form-checkbox rounded-lg text-green-500"
                  readOnly
                />
                <span className="pl-2 text-sm">Numbers</span>
              </div>
            </div>
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
