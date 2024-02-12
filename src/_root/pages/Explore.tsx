import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/useDebounce";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations";
import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer";

// When the user goes to Explore Page there is two things to render on the screen
// If the user is searching then it should render the search result and if the user is not searching
// then it means that searchValue is empty then it also means that shouldShowSearchResult will be false.
// Hence we checked the condition for shouldShowPosts !shouldShowSearchResults
// posts.pages.every((item) => item.documents.length === 0) agar koy ek bhi item nahi hai to tab bhi display
// nahi hoga  If all pages have no documents, it means there are no regular posts to display.
const Explore = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();
  const [searchValue, setSearchValue] = useState('');
  // debouncedValue server par load ek certain milli-seconds ke baat lagata haii
  // Agar aisa na kare to to jab bhi koy character search box me type hoga tab tab 
  // ye server ko search ke liye request bhejega jo ki ek achhi baat nahi hai as server par load increase hoga
  // is cheez ko avoid karne ke liye hum debounce ka istemal karte hai jo ek particular time ke baad server ko request 
  // bhejta haiii.
  const debouncedValue = useDebounce(searchValue, 500);
  const {data: searchedPosts, isFetching: isSearchFetching} = useSearchPosts(debouncedValue);

  useEffect(() => {
    if(inView && !searchValue) fetchNextPage();
  }, [inView, searchValue])


  if(!posts){
    return (
      <div className="flex-center w-full h-full">
        <Loader/>
      </div>
    )
  }
  const shouldShowSearchResults = searchValue !== '';
  const shouldShowPosts = !shouldShowSearchResults &&  posts.pages.every((item) => item?.documents.length === 0);
  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Projects</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img 
            src="/assets/icons/search.svg" 
            width={24}
            height={24}
            alt="" 
          />
          <Input 
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img 
            src="/assets/icons/filter.svg" 
            alt="filter"
            width={20}
            height={20} 
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults? (
          <SearchResults 
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ): shouldShowPosts? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ): posts.pages.map((item, index) => (
          <GridPostList key={`page-${index}`} posts={item.documents}/>
        ))}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader/>
        </div>
      )}
    </div>
  )
}

export default Explore