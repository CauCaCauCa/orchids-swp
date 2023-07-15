import { createContext, useEffect } from "react";
import usePage from "../../hooks/usePage";
import { FetchPostsByPage, GetPostsStats } from "../../../../api/adminAPI";
import useFetch from "../../hooks/useFetch";

export const PostContext = createContext({});

export default function PostContextProvider({ children }) {
  const {
    list: posts,
    setList: setPosts,
    changePage,
    total: totalPosts,
    isLoading,
  } = usePage(FetchPostsByPage);

  const {
    data: postStats,
    refresh: refreshPostStats,
    isLoading: isLoadingPostStats
} = useFetch(GetPostsStats);

  return (
    <PostContext.Provider
      value={{
        data: {
          posts,
          changePage,
          totalPosts,
          isLoading,
        },
        stats: {
          postStats,
          refreshPostStats,
          isLoadingPostStats
        }
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
