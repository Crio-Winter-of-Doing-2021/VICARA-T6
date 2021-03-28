import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, Flip } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';

import Navbar from '../../components/Helper/Navbar';
import DriveMain from '../../components/DriveHome';

import { FileContextProvider } from '../../contexts/FileCopy';

const queryClient = new QueryClient();

function DriveHome() {
  return (
    <>
      <Navbar />
      <QueryClientProvider client={queryClient}>
        <FileContextProvider>
          <ToastContainer
            position="bottom-right"
            newestOnTop={true}
            transition={Flip}
            closeOnClick
            autoClose={false}
          />
          <DriveMain />
        </FileContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default DriveHome;
