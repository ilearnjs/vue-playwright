import crypto from 'crypto'
import type { User, UserResponse } from '../types'

interface Session {
  id: string
  user: User
  createdAt: Date
  lastAccessedAt: Date
}
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    passwordHash: 'password',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

class SessionService {
  private sessions: Map<string, Session> = new Map()

  private generateSessionId(): string {
    return crypto.randomUUID().replace(/-/g, '') +
           crypto.randomBytes(16).toString('hex')
  }

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name
    }
  }

  async authenticateUser(email: string, password: string): Promise<UserResponse | null> {
    const user = MOCK_USERS.find(u => u.email === email)

    if (!user) {
      return null
    }

    if (password !== user.passwordHash) {
      return null
    }

    return this.toUserResponse(user)
  }

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

  getSession(sessionId: string): Session | null {
    const session = this.sessions.get(sessionId)

    if (!session) {
      return null
    }

    session.lastAccessedAt = new Date()
    return session
  }

  getUserBySession(sessionId: string): UserResponse | null {
    const session = this.getSession(sessionId)

    if (!session) {
      return null
    }

    return this.toUserResponse(session.user)
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId)
  }

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

  getSessionCount(): number {
    return this.sessions.size
  }

  getUserByEmail(email: string): User | null {
    return MOCK_USERS.find(u => u.email === email) || null
  }
}

export const sessionService = new SessionService()