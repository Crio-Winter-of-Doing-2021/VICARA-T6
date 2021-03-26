import Navbar from '../../components/Helper/Navbar';
import DriveMain from '../../components/DriveHome';

import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function DriveHome() {
  return (
    <>
      <Navbar />
      <QueryClientProvider client={queryClient}>
        <DriveMain />
      </QueryClientProvider>
    </>
  );
}

export default DriveHome;
