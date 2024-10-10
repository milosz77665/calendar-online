"use client";
import { createUserInFirestore, doesUserExist } from "@/api/userAPI";
import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { setCookie, deleteCookie } from "cookies-next";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
        if (user.providerData[0].providerId === "google.com") {
          if (!(await doesUserExist(user.uid))) {
            const name = user.displayName.split(" ")[0] ?? null;
            const surname = user.displayName.split(" ")[1] ?? null;
            await createUserInFirestore(user.uid, name, surname, user.email);
            grantAccess();
          } else {
            grantAccess();
          }
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function signIn(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
    grantAccess();
  }

  async function register(name, surname, birthDate, email, password) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await createUserInFirestore(user.uid, name, surname, email, birthDate);
    grantAccess();
  }

  async function signInWithGoogle() {
    await signInWithPopup(auth, googleProvider);
  }

  function grantAccess() {
    setCookie("isLoggedIn", "true");
    router.push("/");
  }

  async function logout() {
    setUser(null);
    await signOut(auth);
    deleteCookie("isLoggedIn");
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signInWithGoogle, register, logout, grantAccess }}>
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
}
