import logo from '../../assets/logo.svg';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md bg-bottom bg-color-grey border-solid border-b-2">
      <div className="max-w-full mx-auto px-8 sm:px-6">
        <div className="relative flex items-center justify-between h-16">
          <div className="hidden inset-y-0 left-0 items-center sm:flex">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/*
                Icon when menu is closed.
                Heroicon name: outline/menu
                Menu open: "hidden", Menu closed: "block"
              */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/*
                Icon when menu is open.
                Heroicon name: outline/x
                Menu open: "block", Menu closed: "hidden"
              */}
              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-left sm:items-stretch sm:justify-center">
            <div className="absolute flex-shrink-0 flex items-center mr-12">
              <img
                className="hidden h-8 w-auto sm:block"
                src={logo}
                alt="Workflow"
              />
              <img
                className="h-12 w-auto sm:hidden"
                src={logo}
                alt="Workflow"
              />
            </div>
            <div className="flex justify-center w-full sm:ml-6 sm:hidden">
              <div className="rounded-tl-lg rounded-tr-lg w-10/12 overflow-hidden bg-white px-12">
                <div className="flex justify-between">
                  <div className="inline-flex border rounded w-full px-2 lg:px-6 h-12 bg-transparent">
                    <div className="flex flex-wrap items-stretch w-full h-full mb-6 relative">
                      <div className="flex">
                        <span className="flex items-center leading-normal bg-transparent rounded rounded-r-none border border-r-0 border-none lg:px-3 py-2 whitespace-no-wrap text-grey-dark text-sm">
                          <svg
                            width="18"
                            height="18"
                            className="w-4 lg:w-auto"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.11086 15.2217C12.0381 15.2217 15.2217 12.0381 15.2217 8.11086C15.2217 4.18364 12.0381 1 8.11086 1C4.18364 1 1 4.18364 1 8.11086C1 12.0381 4.18364 15.2217 8.11086 15.2217Z"
                              stroke="#455A64"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16.9993 16.9993L13.1328 13.1328"
                              stroke="#455A64"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="flex-shrink flex-grow leading-normal tracking-wide w-px flex-1 border border-none border-l-0 rounded rounded-l-none px-3 relative focus:outline-none text-xxs lg:text-xs lg:text-base text-gray-500 font-thin"
                        placeholder="Search"
                      />
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
                  className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.DK3glilaJHLDWStvRbGLaAHaHa%26pid%3DApi&f=1"
                    alt=""
                  />
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
