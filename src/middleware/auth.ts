import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/auth';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    rol: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(403).json({ success: false, message: 'Token inválido o expirado' });
  }

  req.user = payload;
  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ success: false, message: 'Acceso denegado. Solo administrador' });
  }
  next();
};

export const requireStaff = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.rol !== 'staff' && req.user?.rol !== 'admin') {
    return res.status(403).json({ success: false, message: 'Acceso denegado' });
  }
  next();
};
