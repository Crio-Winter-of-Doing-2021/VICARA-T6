import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, Flip } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';

import Navbar from '../../components/Helper/Navbar';

import { SearchContextProvider } from '../../contexts/SearchFiles';
import { FileContextProvider } from '../../contexts/File';

const queryClient = new QueryClient();

function BaseLayout(props: any) {
  return (
    <>
      <SearchContextProvider>
        <FileContextProvider>
          <Navbar />
          <QueryClientProvider client={queryClient}>
            <ToastContainer
              position="bottom-right"
              newestOnTop={true}
              transition={Flip}
              closeOnClick
              limit={5}
              autoClose={false}
            />
            {props.children}
          </QueryClientProvider>
        </FileContextProvider>
      </SearchContextProvider>
    </>
  );
}

export default BaseLayout;
