import { createContext, useEffect } from "react";
import usePage from "../../hooks/usePage";
import { FetchPostsByPage, GetPostsStats } from "../../../../api/adminAPI";
import useFetch from "../../hooks/useFetch";

export const PostContext = createContext({});

export default function PostContextProvider({ children }) {

  const AllPosts = usePage(FetchPostsByPage);
  const PostStats = useFetch(GetPostsStats);

  return (
    <PostContext.Provider
      value={{
        data: {
          posts: AllPosts.list,
          changePage: AllPosts.changePage,
          totalPosts: AllPosts.total,
          isLoading: AllPosts.isLoading,
        },
        stats: {
          postStats: PostStats.data,
          refreshPostStats: PostStats.refresh,
          isLoadingPostStats: PostStats.isLoading
        }
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
