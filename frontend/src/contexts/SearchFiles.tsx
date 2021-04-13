import { createContext, useContext, useState } from 'react';

type ContextProps = {
  searchText?: any;
  setSearch?: any;
};

const SearchContext = createContext<ContextProps>({});

export const useSearchContext = () => useContext(SearchContext);

export const SearchContextProvider = (props: any) => {
  const [searchText, setSearch] = useState('');

  return (
    <SearchContext.Provider
      value={{
        searchText,
        setSearch
      }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};
