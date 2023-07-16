import { createContext, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import { createTeamPost, getTeamPostsByTimestamp, getTeamPostsByTimestampDefault } from "../../api/teamAPI";
import { TeamHomepageContext } from "./TeamHomepageContext";
import { NotificationContext } from "../NotificationContext";
import TeamPostDetailsContextProvider from "./TeamPostDetailsContextOLD";
import { CommentPost, LikeCommentPost, UnlikeCommentPost } from "../../api/postAPI";

export const TeamPostContext = createContext();

export default function TeamPostContextProvider({ children }) {

    const { team, setTeam } = useContext(TeamHomepageContext);

    const [listPosts, isLoadingPosts, refresh, setListPosts] = useFetch(getTeamPostsByTimestampDefault, team.email);
    const { showSuccess, showError } = useContext(NotificationContext);


    function addPost(title, content, previewUrl) {
        const createTeamPostInDB = async () => {
            const response = await createTeamPost(team.email, title, content, previewUrl);
            if (response) {
                showSuccess("Đăng bài thành công")
                setListPosts((prev) => {
                    return [response, ...prev];
                })
                setTeam((prev) => {
                    return {
                        ...prev,
                        NumberPost: prev.NumberPost + 1
                    }
                })
            } else {
                showError("Đăng bài thất bại")
            }
        }

        createTeamPostInDB();
    }

    async function getNextPosts(latestId) {
        const getPosts = async () => {
            const response = await getTeamPostsByTimestamp(team.email, latestId);
            if (response) {
                listPosts.push(...response);
                setListPosts([...listPosts])
                return response.length;
            }
        }
        return await getPosts();
    }

    async function addComment(postId, content) {
        if(!content) {
            showError("Nội dung bình luận không được để trống");
            return null;
        }
        const response = await CommentPost(postId, content);
        if(response) {
            const index = listPosts.findIndex(post => post._id === postId);
            listPosts[index].ListComment.push(response);
            setListPosts([...listPosts]);
            showSuccess("Bình luận thành công");
            return response.comment;
        } else {
            showError("Bình luận thất bại");
            return null;
        }
    }

    async function toggleLikeComment(postId, date, email) {

        async function likeComment(postId, date, email) {
            const response = await LikeCommentPost(postId, date, email);
            if(response) {
                const index = listPosts.findIndex(post => post._id === postId);
                const commentIndex = listPosts[index].ListComment.findIndex(comment => comment.date === date && comment.email === email);
                listPosts[index].ListComment[commentIndex].ListEmailLiked.push(email);
                setListPosts([...listPosts]);
                showSuccess("Thích bình luận thành công");
                return true;
            } else {
                showError("Thích bình luận thất bại");
                return false;
            }
        }

        async function unlikeComment(postId, date, email) {
            const response = await UnlikeCommentPost(postId, date, email);
            if(response) {
                const index = listPosts.findIndex(post => post._id === postId);
                const commentIndex = listPosts[index].ListComment.findIndex(comment => comment.date === date && comment.email === email);
                const emailIndex = listPosts[index].ListComment[commentIndex].ListEmailLiked.findIndex(emailLiked => emailLiked === email);
                listPosts[index].ListComment[commentIndex].ListEmailLiked.splice(emailIndex, 1);
                setListPosts([...listPosts]);
                showSuccess("Bỏ thích bình luận thành công");
                return true;
            } else {
                showError("Bỏ thích bình luận thất bại");
                return false;
            }
        }

        const post = listPosts.find(post => post._id === postId);
        if(!post) return;
        const comment = post.ListComment.find(comment => comment.date === date && comment.email === email);
        if(!comment) return;
        const index = comment.ListEmailLiked.findIndex(emailLiked => emailLiked === email);

        if(index === -1) {
            return await likeComment(postId, date, email);
        } else {
            return await unlikeComment(postId, date, email);
        }
    }

    return (
        <TeamPostContext.Provider value={{ listPosts, getNextPosts, addPost, addComment, toggleLikeComment }}>
            <TeamPostDetailsContextProvider>
                {children}
            </TeamPostDetailsContextProvider>
        </TeamPostContext.Provider>
    )
}