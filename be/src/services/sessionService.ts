import crypto from 'crypto'
import type { User, UserResponse } from '../types'

// In-memory session storage
interface Session {
  id: string
  user: User
  createdAt: Date
  lastAccessedAt: Date
}

// Mock user data - in production this would come from a database
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    passwordHash: 'password', // In production, this would be bcrypt hashed
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

class SessionService {
  private sessions: Map<string, Session> = new Map()

  // Generate cryptographically secure random session ID
  private generateSessionId(): string {
    return crypto.randomUUID().replace(/-/g, '') +
           crypto.randomBytes(16).toString('hex')
  }

  // Convert User to UserResponse (remove sensitive data)
  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name
    }
  }

  // Authenticate user by email and password
  async authenticateUser(email: string, password: string): Promise<UserResponse | null> {
    // Find user by email
    const user = MOCK_USERS.find(u => u.email === email)

    if (!user) {
      return null
    }

    // In production, this would be: await bcrypt.compare(password, user.passwordHash)
    if (password !== user.passwordHash) {
      return null
    }

    return this.toUserResponse(user)
  }

  // Create new session
  createSession(user: User): string {
    const sessionId = this.generateSessionId()
    const session: Session = {
      id: sessionId,
      user,
      createdAt: new Date(),
      lastAccessedAt: new Date()
    }

    this.sessions.set(sessionId, session)
    return sessionId
  }

  // Get session by ID
  getSession(sessionId: string): Session | null {
    const session = this.sessions.get(sessionId)

    if (!session) {
      return null
    }

    // Update last accessed time
    session.lastAccessedAt = new Date()
    return session
  }

  // Get user by session ID
  getUserBySession(sessionId: string): UserResponse | null {
    const session = this.getSession(sessionId)

    if (!session) {
      return null
    }

    return this.toUserResponse(session.user)
  }

  // Delete session (logout)
  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId)
  }

  // Clean up expired sessions (optional - for production)
  cleanupExpiredSessions(maxAge: number = 7 * 24 * 60 * 60 * 1000): number {
    const now = new Date()
    let deletedCount = 0

    for (const [sessionId, session] of this.sessions.entries()) {
      const age = now.getTime() - session.lastAccessedAt.getTime()
      if (age > maxAge) {
        this.sessions.delete(sessionId)
        deletedCount++
      }
    }

    return deletedCount
  }

  // Get session count (for debugging)
  getSessionCount(): number {
    return this.sessions.size
  }

  // Get user by email (helper method)
  getUserByEmail(email: string): User | null {
    return MOCK_USERS.find(u => u.email === email) || null
  }
}

// Export singleton instance
export const sessionService = new SessionService()