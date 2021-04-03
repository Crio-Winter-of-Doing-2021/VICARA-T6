import { BsSearch } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { RiLogoutCircleLine } from 'react-icons/ri';

import Axios from '../../config/axios';
import logo from '../../assets/logo.svg';
import { useSearchContext } from '../../contexts/SearchFiles';

interface fields {
  searchText?: string;
}

export default function Navbar() {
  const history = useHistory();
  const { handleSubmit, register } = useForm();
  const { setSearch } = useSearchContext();

  const handSignOut = async () => {
    await Axios.post('/signout');
    history.push('/auth/login');
  };

  const onSubmit = (values: fields) => {
    const { searchText } = values;
    setSearch(searchText);
    history.push(`/search?text=${searchText}`);
  };

  return (
    <nav className="bg-white shadow-md bg-bottom bg-color-grey border-solid border-b-2">
      <div className="max-w-full mx-auto px-8 sm:px-6">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-left sm:items-stretch sm:justify-center">
            <div className="flex-shrink-0 flex items-center mr-auto">
              <img className="h-12 w-auto" src={logo} alt="Workflow" />
            </div>
            <div className="flex justify-center w-full sm:ml-6 sm:hidden">
              <div className="rounded-tl-lg rounded-tr-lg w-10/12 overflow-hidden bg-white px-12">
                <div className="flex justify-between">
                  <div className="inline-flex border rounded w-full px-2 lg:px-6 h-12 bg-transparent">
                    <div className="flex flex-wrap items-stretch w-full h-full mb-6 relative">
                      <span className="ml-2 flex items-center leading-normal bg-transparent rounded rounded-r-none border border-r-0 border-none lg:px-3 py-2 whitespace-no-wrap text-grey-dark text-sm">
                        <BsSearch />
                      </span>
                      <form
                        className="h-full"
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        <input
                          type="text"
                          ref={register}
                          className="h-full leading-normal tracking-wide border border-none border-l-0 rounded rounded-l-none px-3 relative focus:outline-none text-xxs lg:text-xs text-gray-700 font-thin"
                          placeholder="Search Files and Folders"
                          name="searchText"
                        />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:pr-0">
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="mr-4 px-5 py-2 border-red-500 border text-red-500 rounded transition duration-300 hover:bg-red-700 hover:text-white focus:outline-none"
                  id="signout"
                  onClick={handSignOut}
                >
                  <span className="flex items-center">
                    <RiLogoutCircleLine className="mr-1" />
                    Sign Out
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu, show/hide based on menu state. */}
      <div className="hidden sm:block" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <input
            className="bg-gray-200 text-white px-3 py-2 rounded-md text-sm font-medium w-full"
            aria-current="page"
          />
        </div>
      </div>
    </nav>
  );
}
