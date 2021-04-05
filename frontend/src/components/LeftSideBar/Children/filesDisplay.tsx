import fileMapper from '../../../utils/helper/fileMapper';

export default function FileDisplay(props: any) {
  const { id, isDirectory, fileName } = props.data;

  return (
    <div
      key={id}
      className="space-y-2 px-2 flex justify-between relative border-b border-t py-3 border-gray-200"
      aria-label="Dashboards"
    >
      <span
        className="hover:bg-gray-200 rounded-3xl cursor-pointer py-2 px-2 absolute right-1"
        onClick={() => props.callback(id)}
      >
        {props.icon}
      </span>
      <div className="flex">
        <img
          className="mr-3"
          height={20}
          width={20}
          src={fileMapper(fileName, isDirectory)}
        />
        <div className="text-sm leading-5 text-blue-900 max-w-175 overflow-ellipsis overflow-hidden whitespace-nowrap">
          {fileName}
        </div>
      </div>
    </div>
  );
}
