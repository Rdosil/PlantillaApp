"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "../lib/hooks/useAuth";
import { updateDocument } from "../lib/firebase/firebaseUtils";

interface PostProps {
  post: {
    id: string;
    author: string;
    text: string;
    imageUrl?: string;
    likes: number;
    comments?: { user: string; text: string }[];
  };
}

export default function Post({ post }: PostProps) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || 0);
  const [comment, setComment] = useState("");

  const handleLike = async () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    await updateDocument("posts", post.id, { likes: newLikes });
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const newComments = [...(post.comments || []), { user: user?.displayName || "", text: comment }];
    await updateDocument("posts", post.id, { comments: newComments });
    setComment("");
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <p className="font-bold mb-2">{post.author}</p>
      <p className="mb-2">{post.text}</p>
      {post.imageUrl && (
        <Image src={post.imageUrl} alt="Post image" width={300} height={200} className="mb-2" />
      )}
      <button onClick={handleLike} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
        Like ({likes})
      </button>
      <form onSubmit={handleComment} className="mt-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Añadir un comentario"
          className="border rounded px-2 py-1 mr-2"
        />
        <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded">
          Comentar
        </button>
      </form>
      {post.comments && (
        <div className="mt-2">
          <h3 className="font-bold">Comentarios:</h3>
          {post.comments.map((comment, index) => (
            <p key={index}>
              <span className="font-bold">{comment.user}:</span> {comment.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}