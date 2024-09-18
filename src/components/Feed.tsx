"use client";

import React, { useState, useEffect } from "react";
import { getDocuments, updateDocument } from "../lib/firebase/firebaseUtils";
import Post from "./Post";

interface PostType {
  id: string;
  [key: string]: any;
}

export default function Feed() {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getDocuments("posts");
      setPosts(fetchedPosts as PostType[]);
    };
    fetchPosts();
  }, []);

  const handleUpdatePost = (id: string, newText: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { ...post, text: newText } : post
      )
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Feed</h2>
      {posts.map((post) => (
        <Post key={post.id} post={post} onUpdate={handleUpdatePost} />
      ))}
    </div>
  );
}