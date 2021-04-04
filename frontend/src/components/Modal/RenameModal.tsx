import { useRef } from 'react';
import Modal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import Axios from '../../config/axios';
import { toast } from 'react-toastify';
import { useFileContext } from '../../contexts/File';

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

interface renameModalProps {
  name?: string;
}

export default function RenameModal(props: any) {
  const { handleSubmit, register, setError, errors } = useForm({
    defaultValues: {
      name: props.name
    }
  });

  const { filesCounter, setFilesCounter } = useFileContext();
  const toastId: any = useRef(null);

  const onSubmit = async (values: renameModalProps) => {
    try {
      await Axios.post('/rename_file', {
        id: props.id,
        parent: props.parent,
        name: values.name
      });

      toastId.current = toast('Rename successfull');

      props.setIsOpenModal(false);

      toast.update(toastId.current, {
        render: 'Rename successfull',
        type: toast.TYPE.INFO,
        autoClose: 1000
      });

      setFilesCounter(filesCounter + 1);
    } catch (error) {
      console.log(error.response.data.err);

      setError('name', {
        type: 'manual',
        message: error.response.data.err
      });
    }
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
          <div className="flex flex-col px-5 py-5 h-64 w-96">
            <div>
              <h2 className="text-lg">Rename</h2>
              <br />
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mt-3 flex flex-col">
                    <input
                      className={`rounded-sm border py-3 px-3 text-lg text-grey-darkest focus:outline-none 
                      ${
                        errors.name &&
                        'border-red-400 focus:border-red-600 focus:border-4'
                      }`}
                      type="text"
                      name="name"
                      placeholder="Enter new name for file"
                      ref={register({
                        required: 'Cannot set an empty file name'
                      })}
                    />
                  </div>
                  <div className="mt-2 text-red-500">
                    {errors.name && errors.name.message}
                  </div>
                  <div className="my-5 flex flex-col">
                    <input
                      type="submit"
                      className="py-3.5 bg-pink-600 text-white rounded-sm cursor-pointer hover:bg-pink-700 duration-100"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      </Modal>
    </div>
  );
}
