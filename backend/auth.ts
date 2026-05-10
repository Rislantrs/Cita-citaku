/**
 * Firebase Admin Auth Middleware
 * Verifies Firebase ID tokens server-side to enforce authentication
 * and role-based access control. This is the backbone of the
 * "Backend-First" philosophy — never trust the frontend.
 */

import admin from 'firebase-admin';
import type { Request, Response, NextFunction } from 'express';

// Initialize Firebase Admin SDK (uses Application Default Credentials or service account)
// In production, set GOOGLE_APPLICATION_CREDENTIALS env var to a service account JSON path.
// In development, we can initialize with the project ID only (works with Firestore emulator).
if (!admin.apps.length) {
  try {
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0509149540';
    
    admin.initializeApp({
      projectId,
    });
    console.log('[auth] Firebase Admin initialized with project:', projectId);
  } catch (e) {
    console.warn('[auth] Firebase Admin initialization failed. Admin auth will be bypassed in dev mode.', e);
  }
}

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role?: string;
  };
}

/**
 * Middleware: Verify Firebase ID Token
 * Extracts the token from Authorization header (Bearer <token>)
 * and attaches decoded user info to req.user.
 * If no token is present, request passes through with req.user = undefined.
 */
export async function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.split('Bearer ')[1];
  
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
    };

    // Fetch role from Firestore (cached per request)
    try {
      const db = admin.firestore();
      const userDoc = await db.collection('users').doc(decoded.uid).get();
      
      if (userDoc.exists) {
        req.user.role = userDoc.data()?.role || 'user';
      } else {
        req.user.role = 'user';
      }
    } catch (roleErr) {
      console.warn('[auth] Could not fetch user role from Firestore, defaulting to "user":', roleErr);
      req.user.role = 'user';
    }
  } catch (err) {
    // Token invalid or expired — treat as unauthenticated
    console.warn('[auth] Token verification failed:', err);
  }

  next();
}

/**
 * Middleware: Require Authentication
 * Blocks requests that don't have a valid Firebase token.
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user?.uid) {
    res.status(401).json({ error: 'Autentikasi diperlukan. Silakan login terlebih dahulu.' });
    return;
  }
  next();
}

/**
 * Middleware: Require Admin Role
 * Blocks requests from non-admin users. Must be used AFTER requireAuth.
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user?.uid) {
    res.status(401).json({ error: 'Autentikasi diperlukan.' });
    return;
  }

  const role = req.user.role;
  if (role !== 'admin' && role !== 'super_admin' && role !== 'moderator') {
    res.status(403).json({ error: 'Akses ditolak. Hanya admin yang diizinkan.' });
    return;
  }
  
  next();
}

export { admin };
