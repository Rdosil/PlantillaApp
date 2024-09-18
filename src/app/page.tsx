"use client";

import React, { useState } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import SignInWithGoogle from "../components/SignInWithGoogle";
import Feed from "../components/Feed";
import Profile from "../components/Profile";
import CreatePost from "../components/CreatePost";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-8">Bienvenido a nuestra Red Social</h1>
        <SignInWithGoogle />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <nav className="w-full max-w-2xl mb-8">
        <ul className="flex justify-around items-center">
          {["home", "profile"].map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md ${
                  activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => setIsCreatingPost(!isCreatingPost)}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              {isCreatingPost ? "Cerrar" : "Crear Post"}
            </button>
          </li>
        </ul>
      </nav>
      <div className="w-full max-w-2xl">
        {isCreatingPost && (
          <div className="mb-8">
            <CreatePost onPostCreated={() => setIsCreatingPost(false)} />
          </div>
        )}
        {activeTab === "home" && <Feed />}
        {activeTab === "profile" && <Profile />}
      </div>
    </main>
  );
}
