import { useRef, useState } from 'react';
import Modal from 'react-modal';
import Loader from 'react-loader-spinner';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { FiCopy } from 'react-icons/fi';
import Axios from '../../config/axios';
import { toast } from 'react-toastify';

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

export default function GenerateLinkModal(props: any) {
  const toastId: any = useRef(null);
  const [shareableURL, setShareableURL] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const getShareableLink = async (id: string) => {
    setLoading(true);

    try {
      const result = await Axios.get(`/downloads/shareurl/${id}`);
      console.log(result);
      if (result.data.url) {
        setShareableURL(result.data.url);
      }

      toastId.current = toast('Shareable link generated');

      //   props.setIsOpenModal(false);

      toast.update(toastId.current, {
        render: 'Shareable link generated',
        type: toast.TYPE.INFO,
        autoClose: 1000
      });

      setLoading(false);
    } catch (error) {
      console.log(error.response.data.err);
    }
  };

  const copyTextToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

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
          <div className="flex flex-col px-5 py-5 w-96 h-80">
            <div>
              <h2 className="text-lg">Generate Shareable Link for</h2>
              <br />
              <div>
                <div className="flex flex-col">
                  <p
                    className={
                      'rounded-sm py-3 px-3 text-lg text-grey-darkest focus:outline-none'
                    }
                  >
                    {props.name}
                  </p>
                </div>
                <div className="my-5 flex flex-col">
                  <button
                    className="py-3.5 rounded-md bg-pink-600 text-white cursor-pointer hover:bg-pink-700 duration-100"
                    onClick={() => getShareableLink(props.id)}
                  >
                    {!isLoading && <span>Generate Link</span>}
                    {isLoading && (
                      <div className="flex justify-center">
                        <Loader
                          type="Circles"
                          color="#FFFFFF"
                          height={20}
                          width={20}
                        />
                      </div>
                    )}
                  </button>
                </div>
                <div>
                  {shareableURL === null && (
                    <div className="my-5 flex flex-col">
                      <button
                        className="py-3.5 rounded-md bg-gray-200 text-white cursor-pointer hover:bg-gray-200 duration-100 flex justify-center items-center"
                        disabled
                      >
                        <FiCopy className="mr-2" />
                        Copy Link
                      </button>
                    </div>
                  )}
                  {shareableURL !== null && (
                    <div className="my-5 flex flex-col">
                      <button
                        className="py-3.5 rounded-md bg-green-600 text-white cursor-pointer hover:bg-green-700 duration-100 flex justify-center items-center"
                        onClick={() => copyTextToClipboard(shareableURL)}
                      >
                        <FiCopy className="mr-2" />
                        Copy Link
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      </Modal>
    </div>
  );
}
