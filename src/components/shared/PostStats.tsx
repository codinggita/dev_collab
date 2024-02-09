import { useDeleteSavePost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

type PostStatsProps = {
    post?: Models.Document;
    userId: string;
}

const PostStats = ({post, userId}: PostStatsProps) => {
  const likeList = post?.likes.map((user: Models.Document) => user.$id);
  const [ likes, setLikes ] = useState(likeList);
  const [ isSaved, setIsSaved ] = useState(false);
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSavedPost } = useDeleteSavePost();
  const { data: currentUser } = useGetCurrentUser();

  // Check if the post is already saved by the current user (.save comes from the attributes of the User collections)
  const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post?.$id);
  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [currentUser])

  // Function for handling the likes for the post
  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation(); // To Stop Event Bubbling; if not written then it will also click the profile photo as it is clickable
    let newLikes = [...likes];
    // Check if the user has already liked the post
    const hasLiked = newLikes.includes(userId);
    // Toggle like status based on whether the user has already liked the post
    if(hasLiked){
        // If user has already liked the post, remove their like
        newLikes = newLikes.filter((id) => id !== userId)
    } else {
        // If user has not liked the post, add their like
        newLikes.push(userId);
    }
    setLikes(newLikes);
    likePost({postId: post?.$id || '', likesArray: newLikes});
  }

  // Function for handing the saved post
  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation(); // To Stop Event Bubbling; if not written then it will also click the profile photo as it is clickable
    // Toggle save status based on whether the post is already saved
    if(savedPostRecord){
        // If post is already saved, remove it from saved posts
        setIsSaved(false); // Update local state to reflect unsaving
        deleteSavedPost(savedPostRecord.$id); // Call function to delete saved post record
    } else {
        // If post is not saved, save it
        savePost({postId: post?.$id || '', userId}); // Call function to save post
        setIsSaved(true); // Update local state to reflect saving
    }
  }


  return (
    <div className="flex justify-between items-center z-20">
        <div className="flex gap-2 mr-5">
            <img 
                src={`${checkIsLiked(likes, userId)?"/assets/icons/liked.svg":"/assets/icons/like.svg"}`} 
                alt="like" 
                width={20} 
                height={20}
                onClick={handleLikePost}
                className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>

        <div className="flex gap-2">
            {isSavingPost || isDeletingSavedPost ? 
                <Loader/> :
                <img 
                    src={isSaved? "/assets/icons/saved.svg": "/assets/icons/save.svg"}
                    alt="like" 
                    width={20} 
                    height={20}
                    onClick={handleSavePost}
                    className="cursor-pointer"
                />
            }
        </div>

    </div>
  )
}

export default PostStats