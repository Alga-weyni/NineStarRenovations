import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
  };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const user = AuthService.verifyToken(token);
  
  if (!user) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.user = user;
  next();
}
