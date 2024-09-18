"use client";

import React, { useState, useEffect } from "react";
import { getDocuments } from "../lib/firebase/firebaseUtils";
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Feed</h2>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}