"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import { getDocuments, updateDocument } from "../lib/firebase/firebaseUtils";

export default function Profile() {
  const { user } = useAuth();
  const [bio, setBio] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getDocuments("users");
      const currentUser = userData.find((u) => u.id === user.uid);
      if (currentUser) {
        setBio(currentUser.bio || "");
      }
    };
    const fetchUserPosts = async () => {
      const allPosts = await getDocuments("posts");
      const userPosts = allPosts.filter((post) => post.authorId === user.uid);
      setPosts(userPosts);
    };
    fetchUserData();
    fetchUserPosts();
  }, [user]);

  const handleUpdateBio = async () => {
    await updateDocument("users", user.uid, { bio });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Perfil</h2>
      <p className="mb-2">Nombre: {user.displayName}</p>
      <p className="mb-2">Email: {user.email}</p>
      <div className="mb-4">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Escribe tu biografía"
        />
        <button onClick={handleUpdateBio} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          Actualizar biografía
        </button>
      </div>
      <h3 className="text-xl font-bold mb-2">Mis publicaciones</h3>
      {posts.map((post) => (
        <div key={post.id} className="border rounded-lg p-4 mb-4">
          <p>{post.text}</p>
        </div>
      ))}
    </div>
  );
}