import { useEffect } from 'react';
import Modal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

export default function UploadFilesInfo(props: any) {
  const response = [
    {
      name: 'File1.jpeg',
      status: 'Successful',
      message: 'Uploaded Successfully'
    },
    {
      name: 'File2.jpeg',
      status: 'Failed',
      message: 'Duplicate File Exists'
    },
    {
      name: 'File3.jpeg',
      status: 'Successful',
      message: 'Uploaded Successfully'
    },
    {
      name: 'File4.jpeg',
      status: 'Failed',
      message: 'Size Exceed'
    },
    {
      name: 'File1.jpeg',
      status: 'Successful',
      message: 'Uploaded Successfully'
    },
    {
      name: 'File2.jpeg',
      status: 'Failed',
      message: 'Duplicate File Exists'
    },
    {
      name: 'File3.jpeg',
      status: 'Successful',
      message: 'Uploaded Successfully'
    },
    {
      name: 'File4.jpeg',
      status: 'Failed',
      message: 'Size Exceed'
    }
  ];

  useEffect(() => {
    console.log(props);
  }, [props]);

  function closeModal() {
    props.setIsOpenModal(false);
  }

  return (
    <div>
      <Modal
        isOpen={props.modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <>
          <div className="absolute right-4 top-3">
            <button onClick={closeModal}>
              <AiOutlineCloseCircle />
            </button>
          </div>
          <div className="flex flex-col px-5 py-10 h-80vh w-54rem justify-center">
            <div className="flex justify-center flex-col items-center">
              <h2 className="text-lg mb-10">Upload File Status</h2>
              <br />
              <div>
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
                    {response.map((file, index) => {
                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-md leading-5">
                            {file.name}
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-200 text-sm leading-5">
                            {file.status === 'Failed' && (
                              <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                <span
                                  aria-hidden
                                  className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                                ></span>
                                <span className="relative text-xs">Failed</span>
                              </span>
                            )}
                            {file.status === 'Successful' && (
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
            </div>
          </div>
        </>
      </Modal>
    </div>
  );
}
