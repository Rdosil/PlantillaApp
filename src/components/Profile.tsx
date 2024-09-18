"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "../lib/hooks/useAuth";
import { getDocuments, updateDocument, uploadFile } from "../lib/firebase/firebaseUtils";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase/firebase";
import { PencilIcon, CheckIcon, XIcon } from 'lucide-react'; // Asegúrate de instalar lucide-react

interface Post {
  id: string;
  text: string;
}

interface ProfileImagePosition {
  x: number;
  y: number;
}

export default function Profile() {
  const { user } = useAuth();
  const [bio, setBio] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState<ProfileImagePosition>({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setBio(userData.bio || "");
          setEditedBio(userData.bio || "");
          setProfileImage(userData.profileImage || null);
          setImagePosition(userData.imagePosition || { x: 50, y: 50 });
        }
      }
    };
    const fetchUserPosts = async () => {
      const allPosts = await getDocuments("posts");
      const userPosts = allPosts.filter((post: any) => post.authorId === user?.uid);
      setPosts(userPosts);
    };
    fetchUserData();
    fetchUserPosts();
  }, [user]);

  const handleUpdateBio = async () => {
    if (user) {
      await updateDocument("users", user.uid, { bio: editedBio });
      setBio(editedBio);
      setIsEditingBio(false);
    }
  };

  const handleCancelEditBio = () => {
    setEditedBio(bio);
    setIsEditingBio(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const imageUrl = await uploadFile(file, `profileImages/${user.uid}`);
      setProfileImage(imageUrl);
      setImagePosition({ x: 50, y: 50 }); // Reset position when new image is uploaded
      await updateDocument("users", user.uid, { profileImage: imageUrl, imagePosition: { x: 50, y: 50 } });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setImagePosition({ x, y });
    }
  };

  const handleMouseUp = async () => {
    setIsDragging(false);
    if (user) {
      await updateDocument("users", user.uid, { imagePosition });
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Perfil</h2>
      <div className="mb-4">
        {profileImage ? (
          <div 
            ref={imageRef}
            className="relative w-24 h-24 rounded-full overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div 
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundImage: `url(${profileImage})`,
                backgroundPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                backgroundSize: 'cover',
              }}
            />
          </div>
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-3xl">{user.displayName?.[0].toUpperCase()}</span>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-2" />
      </div>
      <p className="mb-2">Nombre: {user?.displayName}</p>
      <p className="mb-2">Email: {user?.email}</p>
      <div className="mb-4 relative">
        {isEditingBio ? (
          <>
            <textarea
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              className="border rounded p-2 w-full"
              placeholder="Escribe tu biografía"
            />
            <div className="absolute right-2 top-2">
              <button onClick={handleUpdateBio} className="text-green-500 mr-2">
                <CheckIcon size={20} />
              </button>
              <button onClick={handleCancelEditBio} className="text-red-500">
                <XIcon size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="relative">
            <p className="p-2">{bio || "No hay biografía"}</p>
            <button 
              onClick={() => setIsEditingBio(true)} 
              className="absolute right-2 top-2 text-blue-500"
            >
              <PencilIcon size={20} />
            </button>
          </div>
        )}
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