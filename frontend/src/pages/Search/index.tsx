import LeftSideBar from '../../components/LeftSideBar';
import BaseLayout from '../../components/BaseLayout';
import SearchMain from '../../components/Search';
import { useFileContext } from '../../contexts/File';

function SearchPage() {
  const { displayNavbar } = useFileContext();

  return (
    <BaseLayout>
      <div className="flex">
        <div
          className={`
          ${displayNavbar ? 'block' : 'sm:translate-l-300 sm:hidden block'} 
          border-r-2 border-gray-300 bg-gray-100 bg-opacity-10`}
        >
          <LeftSideBar />
        </div>
        <SearchMain />
      </div>
    </BaseLayout>
  );
}

export default SearchPage;
