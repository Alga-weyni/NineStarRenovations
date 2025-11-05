import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { adminUsers } from '@shared/schema';
import { eq } from 'drizzle-orm';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required for secure authentication');
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(userId: number, username: string): string {
    return jwt.sign(
      { userId, username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  static verifyToken(token: string): { userId: number; username: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static async createAdminUser(username: string, password: string) {
    const passwordHash = await this.hashPassword(password);
    
    const [user] = await db.insert(adminUsers).values({
      username,
      passwordHash,
    }).returning();
    
    return user;
  }

  static async authenticateAdmin(username: string, password: string) {
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);

    if (!user) {
      return null;
    }

    const isValid = await this.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return {
      user,
      token: this.generateToken(user.id, user.username),
    };
  }

  static async checkIfAdminExists(): Promise<boolean> {
    const users = await db.select().from(adminUsers).limit(1);
    return users.length > 0;
  }
}
