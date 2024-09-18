"use client";

import { useState, useEffect } from "react";
import { getDocuments } from "../lib/firebase/firebaseUtils";
import Post from "./Post";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getDocuments("posts");
      setPosts(fetchedPosts);
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