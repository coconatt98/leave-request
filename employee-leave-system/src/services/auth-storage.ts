import { v4 as uuidv4 } from "uuid";
import { STORAGE_KEYS, MOCK_USERS, SESSION_CONFIG, APP_EVENTS, type UserRole } from "@/constants";
import { verifyLoginAction } from "@/app/actions/auth";

type StoredSession = {
  username: string;
  role: UserRole;
  loginTime: string;
  token: string;
  expiresAt: number;
  checksum: string;
};

export class AuthStorageService {
  static async login(username: string, password: string): Promise<boolean> {
    if (typeof window === "undefined") return false;

    // First check mock users (e.g. admin, approver, inputter fallback)
    let user: { username: string; password?: string; role: UserRole } | undefined = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );
    let role = user?.role as UserRole;

    // If not found, check registered employees in DB via Server Action
    if (!user) {
      const employee = await verifyLoginAction(username, password);
      if (employee) {
        user = { username: employee.username!, password: password, role: employee.role as UserRole || "INPUTTER" };
        role = employee.role as UserRole || "INPUTTER";
      }
    }

    if (user) {
      const loginTime = new Date().toISOString();
      const token = uuidv4();
      const expiresAt = Date.now() + SESSION_CONFIG.DURATION_MINUTES * 60 * 1000;
      const payload = { username, role, loginTime, token, expiresAt };
      const session: StoredSession = {
        ...payload,
        checksum: this.generateChecksum(payload),
      };
      localStorage.setItem(
        STORAGE_KEYS.AUTH_SESSION,
        JSON.stringify(session)
      );
      this.emitAuthChange();
      return true;
    }

    return false;
  }

  static logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    this.emitAuthChange();
  }

  static isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  static getSession(): { username: string; role: UserRole; loginTime: string } | null {
    if (typeof window === "undefined") return null;
    const stored = this.getStoredSession();
    if (!stored) return null;
    return { username: stored.username, role: stored.role, loginTime: stored.loginTime };
  }

  private static getStoredSession(): StoredSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (!data) return null;
      const parsed = JSON.parse(data) as Partial<StoredSession>;
      if (!this.isSessionStructureValid(parsed)) {
        this.logout();
        return null;
      }

      const { username, role, loginTime, token, expiresAt, checksum } = parsed;
      if (Date.now() > expiresAt) {
        this.logout();
        return null;
      }

      const expectedChecksum = this.generateChecksum({
        username,
        role,
        loginTime,
        token,
        expiresAt,
      });

      if (checksum !== expectedChecksum) {
        this.logout();
        return null;
      }

      return parsed as StoredSession;
    } catch {
      this.logout();
      return null;
    }
  }

  private static isSessionStructureValid(
    session: Partial<StoredSession> | null
  ): session is StoredSession {
    return (
      !!session &&
      typeof session.username === "string" &&
      typeof session.role === "string" &&
      typeof session.loginTime === "string" &&
      typeof session.token === "string" &&
      typeof session.expiresAt === "number" &&
      typeof session.checksum === "string"
    );
  }

  private static generateChecksum(payload: {
    username: string;
    role: UserRole;
    loginTime: string;
    token: string;
    expiresAt: number;
  }): string {
    const raw = `${payload.username}:${payload.role}:${payload.loginTime}:${payload.token}:${payload.expiresAt}:${SESSION_CONFIG.SECRET}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i += 1) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString(16);
  }

  private static emitAuthChange() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(APP_EVENTS.AUTH_CHANGE));
  }
}
