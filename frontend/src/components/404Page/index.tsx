import ErrorIcon from '../../assets/404.svg';

export default function ErrorPage() {
  return (
    <div className="w-full flex items-center flex-col">
      <img src={ErrorIcon} alt="404" height={100} />
      <p className="text-2xl font-semibold">page not found</p>
    </div>
  );
}
