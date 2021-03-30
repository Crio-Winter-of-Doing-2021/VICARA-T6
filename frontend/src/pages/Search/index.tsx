import LeftSideBar from '../../components/LeftSideBar';
import BaseLayout from '../../components/BaseLayout';
import SearchMain from '../../components/Search';

function SearchPage() {
  return (
    <BaseLayout>
      <div className="flex">
        <LeftSideBar />
        <SearchMain />
      </div>
    </BaseLayout>
  );
}

export default SearchPage;
