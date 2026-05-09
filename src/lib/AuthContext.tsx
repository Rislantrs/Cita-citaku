import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Cek durasi sesi (1 Minggu = 7 hari)
        const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
        const loginTime = localStorage.getItem(`login_timestamp_${currentUser.uid}`);
        
        if (loginTime && (Date.now() - parseInt(loginTime) > ONE_WEEK_MS)) {
          console.log("Sesi berakhir (1 minggu). Mengeluarkan pengguna...");
          await signOut(auth);
          localStorage.removeItem(`login_timestamp_${currentUser.uid}`);
          setUser(null);
          setLoading(false);
          return;
        }

        // Jika belum ada timestamp (misal baru pertama kali update), buat sekarang
        if (!loginTime) {
          localStorage.setItem(`login_timestamp_${currentUser.uid}`, Date.now().toString());
        }

        setUser(currentUser);
        
        // Create user in firestore if not exists
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            fullName: currentUser.displayName || 'Anonymous',
            email: currentUser.email || '',
            role: 'user',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        // Simpan waktu login saat berhasil login SSO
        localStorage.setItem(`login_timestamp_${result.user.uid}`, Date.now().toString());
      }
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/popup-blocked') {
        alert('Mohon izinkan popup di browser kamu untuk login.');
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
