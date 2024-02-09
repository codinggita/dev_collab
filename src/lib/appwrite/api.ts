import { ID, Query } from "appwrite";

import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, databases } from "./config";
import { avatars, storage } from "./config";

export async function createUserAccount(user: INewUser){
    try{
        // Creating the user in Authentication
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );
        if(!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(user.name);
        // Saving the user in database
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        })
        return newUser;
    } catch(error){
        console.log(error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}){
    try{
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        )
        return newUser;

    } catch(error){
        console.log(error);
    }
}

export async function signInAccount(user: {
    email: string;
    password: string;
}){
    try{
        const session = await account.createEmailSession(user.email, user.password);
        return session;

    } catch(error){
        console.log(error);
    }
}

// Getting the current user
export async function getCurrentUser(){
    try{
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if(!currentUser) throw Error;
        return currentUser.documents[0];
    } catch(error){
        console.log(error);
    }
}

export async function signOutAccount(){
    try {
        const session = await account.deleteSession("cuurent");
        return session;
        
    } catch (error) {
        console.log(error);
    }
}

// Create Post
export async function createPost(post: INewPost) {
    try {
      // Uploading file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;
      // Getting file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id); // because something is corrupted or something is not right
        throw Error;
      }
      // Converting tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
      // Creating a post
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        ID.unique(),
        {
          creator: post.userId,
          caption: post.caption,
          imageUrl: fileUrl,
          imageId: uploadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );
      if(!newPost){
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      return newPost;
    } catch (error) {
      console.log(error);
    }
}

// Uploading File to AppWrite
export async function uploadFile(file: File) {
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );
  
      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
}
  
// Getting File URL
export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000, // width
        2000, // height
        "top", // where it should show
        100 // Quality 100 means best
      );
      if (!fileUrl) throw Error;
      return fileUrl;
    } catch (error) {
      console.log(error);
    }
}
  
// Deleting the file with the given fileID
export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);
      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
}



// createdAt will fetch all the latest posts and we need maximum 20 posts
// Getting the recent posts
export async function getRecentPosts(){
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}

// Liking the post
export async function likePost(postId: string, likesArray: string[]){
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    )

    if(!updatedPost) throw Error;
    return updatedPost;
    
  } catch (error) {
    console.log(error);
  }
}


// Saving the post
export async function savePost(postId: string, userId: string){
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId, // What we have to update
        post: postId
      }
    )

    if(!updatedPost) throw Error;
    return updatedPost;
    
  } catch (error) {
    console.log(error);
  }
}

// Deleting the Saved post
export async function deleteSavedPost(savedRecordId: string){
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    )

    if(!statusCode) throw Error;
    return {status:'ok'}
    
  } catch (error) {
    console.log(error);
  }
}

// Getting the post details in order to fetch on edit section
export async function getPostById(postId: string){
    try {
        const post = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.postCollectionId,
          postId
        )
        if(!post) throw Error;
        return post;
    } catch (error) {
      console.log(error);
    }
}

// Updating the post
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    }

    if(hasFileToUpdate){
      // Uploading file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;
      // Getting file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id); // because something is corrupted or something is not right
        throw Error;
      }
      image = {...image, imageUrl: fileUrl, imageId: uploadedFile.$id}
    }
     
    // Converting tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];
    // Creating a post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );
    if(!updatedPost){
      await deleteFile(post.imageId);
      throw Error;
    }
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// Deleting the post
export async function deletePost(postId: string, imageId: string){
  if(!postId || !imageId)throw Error;
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
    if (!statusCode) throw Error;
    await deleteFile(imageId);
    return {status: 'ok'}
  } catch (error) {
    console.log(error);
  }
}


// Fetching the post for Explore page
export async function getInfinitePosts({ pageParam }: { pageParam: number}){
  const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)] 
  if(pageParam){
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    )
    if(!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}

// Searching the post for rendering the Explore page
export async function searchPosts(searchTerm: string){
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search('caption', searchTerm)]
    )
    if(!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}

// GET USERS
export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}


// GET USER BY ID
export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}