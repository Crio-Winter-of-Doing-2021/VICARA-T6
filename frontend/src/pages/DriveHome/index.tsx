import Navbar from '../../components/Helper/Navbar';
import DriveMain from '../../components/DriveHome';

import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function DriveHome() {
  return (
    <>
      <Navbar />
      <QueryClientProvider client={queryClient}>
        <ToastContainer
          position="bottom-right"
          newestOnTop={true}
          transition={Flip}
          hideProgressBar={true}
          closeOnClick
          autoClose={false}
        />
        <DriveMain />
      </QueryClientProvider>
    </>
  );
}

export default DriveHome;
