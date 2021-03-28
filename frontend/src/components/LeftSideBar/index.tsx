import { useEffect, useState } from 'react';
import { GiCancel } from 'react-icons/gi';
import { BsClipboard } from 'react-icons/bs';

import { useFileContext } from '../../contexts/FileCopy';
import fileMapper from '../../utils/helper/fileMapper';

// function HomeSvg() {
//   return (
//     <span aria-hidden="true">
//       <svg
//         className="w-5 h-5"
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//           d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//         />
//       </svg>
//     </span>
//   );
// }

function DropDownArrow(props: any) {
  const { isOpen }: any = props;
  return (
    <svg
      className={`w-4 h-4 transition-transform transform ${
        isOpen && 'rotate-180'
      }`}
      // :className="{ 'rotate-180': open }"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function DropDownCoponent(props: any) {
  const [isOpen, changeOpen] = useState(false);

  return (
    <div className="min-w-225">
      <a
        href="#"
        className={`flex items-center p-2 text-gray-500 transition-colors rounded-md dark:text-light hover:bg-yellow-100 dark:hover:bg-yellow-600 ${
          isOpen && 'bg-yellow-100 dark:bg-yellow-600'
        }`}
        onClick={(e) => {
          e.preventDefault();
          changeOpen(!isOpen);
        }}
        role="button"
        aria-haspopup="true"
        // :aria-expanded="(open || isActive) ? 'true' : 'false'"
      >
        {props.icon}
        <span className="ml-2 text-sm"> {props.heading} </span>
        <span className="ml-auto" aria-hidden="true">
          <DropDownArrow isOpen={isOpen} />
        </span>
      </a>
      <div
        role="menu"
        className={`${!isOpen && 'hidden'} pl-2`}
        aria-label={props.heading}
      >
        {props.children}
      </div>
    </div>
  );
}

export default function LeftSideBar() {
  const [filesList, copyFiles] = useState([]);
  const { copiedFiles, removeFileFromClipboard } = useFileContext();

  useEffect(() => {
    const tempFiles: any = Object.values(copiedFiles).filter(
      (e: any) => e.selected
    );
    copyFiles(tempFiles);
  }, [copiedFiles]);

  return (
    <div>
      <aside className="flex-shrink-0 hidden w-64 bg-white border-r dark:border-blue-800 dark:bg-darker md:block" />
      <div className="flex flex-col h-full">
        <nav
          aria-label="Main"
          className="flex-1 px-2 py-4 space-y-2 overflow-y-hidden hover:overflow-y-auto"
        >
          <DropDownCoponent heading="Dashboards" icon={BsClipboard}>
            <a
              href="#"
              role="menuitem"
              className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:text-gray-400 dark:hover:text-light hover:text-gray-700"
            >
              Default
            </a>
            <a
              href="#"
              role="menuitem"
              className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
            >
              Project Mangement
            </a>
            <a
              href="#"
              role="menuitem"
              className="block p-2 text-sm text-gray-400 transition-colors duration-200 rounded-md dark:hover:text-light hover:text-gray-700"
            >
              E-Commerce
            </a>
          </DropDownCoponent>

          <DropDownCoponent heading="Clipboard" icon={BsClipboard}>
            <>
              {filesList.map(({ id, name, isDirectory }, index) => {
                return (
                  <div
                    key={id}
                    className="space-y-2 px-2 flex justify-between relative border-b border-t py-3 border-gray-200"
                    aria-label="Dashboards"
                  >
                    <span
                      className="hover:bg-gray-200 rounded-3xl cursor-pointer py-2 px-2 absolute right-1"
                      onClick={() => removeFileFromClipboard(id)}
                    >
                      <GiCancel size={16} />
                    </span>
                    <div className="flex">
                      <img
                        className="mr-3"
                        height={20}
                        width={20}
                        src={fileMapper(isDirectory)}
                      />
                      <div className="text-sm leading-5 text-blue-900 max-w-125 overflow-ellipsis overflow-hidden whitespace-nowrap">
                        {name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          </DropDownCoponent>
        </nav>
      </div>
    </div>
  );
}

// #################################################
//  <div className="flex-shrink-0 px-2 py-4 space-y-2">
//             <button
//               //   @click="openSettingsPanel"
//               type="button"
//               className="flex items-center justify-center w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-700 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-dark"
//             >
//               <span aria-hidden="true">
//                 <svg
//                   className="w-4 h-4 mr-2"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
//                   />
//                 </svg>
//               </span>
//               <span>Customize</span>
//             </button>
//           </div>
