"use client";

import React, { useState } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import { addDocument, uploadFile } from "../lib/firebase/firebaseUtils";
import ImageUpload from "./ImageUpload";

export default function CreatePost() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = "";
    if (image && user) {
      imageUrl = await uploadFile(image, `posts/${user.uid}/${Date.now()}`);
    }
    await addDocument("posts", {
      text,
      imageUrl,
      author: user?.displayName,
      authorId: user?.uid,
      createdAt: new Date().toISOString(),
      likes: 0,
      reactions: [], // Inicializa las reacciones como un array vacío
      comments: [],
    });
    setText("");
    setImage(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Crear publicación</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border rounded p-2 w-full mb-4"
          placeholder="¿Qué estás pensando?"
        />
        <ImageUpload onImageChange={setImage} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Publicar
        </button>
      </form>
    </div>
  );
}