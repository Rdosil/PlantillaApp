"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "../lib/hooks/useAuth";
import { updateDocument } from "../lib/firebase/firebaseUtils";

interface Reaction {
  emoji: string;
  count: number;
}

interface PostProps {
  post: {
    id: string;
    author: string;
    authorId: string;
    text: string;
    imageUrl?: string;
    likes: number;
    reactions: Reaction[];
    comments?: { user: string; text: string }[];
  };
  onUpdate: (id: string, newText: string) => void;
}

const emojis = ["👍", "❤️", "😂", "😮", "😢", "😡"];

export default function Post({ post, onUpdate }: PostProps) {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<Reaction[]>(post.reactions || []);
  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(post.text);

  const handleReaction = async (emoji: string) => {
    let newReactions = [...reactions];
    const existingReaction = newReactions.find(r => r.emoji === emoji);
    if (existingReaction) {
      existingReaction.count += 1;
    } else {
      newReactions.push({ emoji, count: 1 });
    }
    setReactions(newReactions);
    await updateDocument("posts", post.id, { reactions: newReactions });
    setShowEmojiPicker(false);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const newComments = [...(post.comments || []), { user: user?.displayName || "", text: comment }];
    await updateDocument("posts", post.id, { comments: newComments });
    setComment("");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    await updateDocument("posts", post.id, { text: editedText });
    onUpdate(post.id, editedText);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedText(post.text);
    setIsEditing(false);
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <p className="font-bold mb-2">{post.author}</p>
      {isEditing ? (
        <div>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="border rounded p-2 w-full mb-2"
          />
          <button onClick={handleSaveEdit} className="bg-green-500 text-white px-2 py-1 rounded mr-2">
            Guardar
          </button>
          <button onClick={handleCancelEdit} className="bg-red-500 text-white px-2 py-1 rounded">
            Cancelar
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-2">{post.text}</p>
          {user?.uid === post.authorId && (
            <button onClick={handleEdit} className="text-blue-500 underline mb-2">
              Editar
            </button>
          )}
        </div>
      )}
      {post.imageUrl && (
        <div className="relative w-full h-64 mb-2">
          <Image 
            src={post.imageUrl} 
            alt="Post image" 
            layout="fill" 
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}
      <div className="flex items-center mb-2">
        {reactions.map((reaction, index) => (
          <span key={index} className="mr-2">
            {reaction.emoji} {reaction.count}
          </span>
        ))}
      </div>
      <div className="flex items-center mb-2">
        <button 
          onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
          className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
        >
          Reaccionar
        </button>
        {showEmojiPicker && (
          <div className="flex">
            {emojis.map((emoji, index) => (
              <button 
                key={index} 
                onClick={() => handleReaction(emoji)}
                className="text-2xl mr-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
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