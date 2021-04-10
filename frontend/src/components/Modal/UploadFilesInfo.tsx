import Modal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useMediaQuery } from '../../utils/helper/mediaQueryHook';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

const responsiveStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '100%',
    padding: '10px'
  }
};

export default function UploadFilesInfo(props: any) {
  const response = props.data;

  const isMobileDevice = useMediaQuery('(min-width: 500px)');

  function closeModal() {
    props.setIsOpenModal(false);
  }

  return (
    <div>
      <Modal
        isOpen={props.modalIsOpen}
        onRequestClose={closeModal}
        style={isMobileDevice ? customStyles : responsiveStyles}
        ariaHideApp={false}
      >
        <>
          <div className="absolute right-4 top-3">
            <button onClick={closeModal}>
              <span className="hover:bg-gray-200 rounded-3xl cursor-pointer flex justify-center py-2 px-2">
                <AiOutlineCloseCircle />
              </span>
            </button>
          </div>
          <div className="flex flex-col px-5 py-10 sm:w-96 h-80vh w-54rem mt-10">
            <div className="flex justify-center flex-col items-center h-inherit">
              <h2 className="text-lg sm:mb-0 mb-10">Upload File Status</h2>
              <br />
              <div className="h-inherit sm:hidden">
                <table className="w-48rem">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-md leading-4 text-blue-500 tracking-wider">
                        <span className="flex justify-between">File Name</span>
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-md leading-4 text-blue-500 tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-md leading-4 text-blue-500 tracking-wider">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {response?.map((file, index) => {
                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-md leading-5">
                            {file.name}
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-sm leading-5">
                            {file.status === 'Failure' && (
                              <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                <span
                                  aria-hidden
                                  className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                                ></span>
                                <span className="relative text-xs">Failed</span>
                              </span>
                            )}
                            {file.status === 'Success' && (
                              <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                <span
                                  aria-hidden
                                  className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                ></span>
                                <span className="relative text-xs">
                                  Successful
                                </span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-md leading-5">
                            {file.message}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="h-full hidden sm:block">
                <div className="w-full">
                  <section>
                    {response?.map((file, index) => {
                      return (
                        <details className="my-2 w-90vw ml-5" key={index}>
                          <summary>
                            {file.status === 'Failure' && (
                              <span className="relative inline-block font-semibold text-red-900 leading-tight my-2">
                                <span className="relative text-s">
                                  {file.name}
                                </span>
                              </span>
                            )}
                            {file.status === 'Success' && (
                              <span className="relative inline-block font-semibold text-green-900 leading-tight my-2">
                                <span className="relative text-s">
                                  {file.name}
                                </span>
                              </span>
                            )}
                          </summary>
                          <span className="relative inline-block px-3 py-1 font-semibold leading-tight my-4">
                            <span className="relative text-s">
                              {file.message}
                            </span>
                          </span>
                        </details>
                      );
                    })}
                  </section>
                </div>
              </div>
            </div>
          </div>
        </>
      </Modal>
    </div>
  );
}
