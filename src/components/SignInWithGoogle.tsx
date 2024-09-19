"use client";

import React from 'react';
import Image from 'next/image';
import { useAuth } from '../lib/hooks/useAuth';

export default function SignInWithGoogle() {
  const { signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error al iniciar sesión con Google", error);
      alert("Hubo un error al iniciar sesión. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center justify-center bg-white text-gray-700 font-semibold py-2 px-4 rounded-full border border-gray-300 hover:bg-gray-100 transition duration-300 ease-in-out"
    >
      <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" width={24} height={24} className="mr-2" />
      Iniciar sesión con Google
    </button>
  );
}
