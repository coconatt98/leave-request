import { v4 as uuidv4 } from "uuid";
import { LeaveRequest, LeaveStatus } from "@/types/leave";
import { APP_EVENTS, STORAGE_KEYS } from "@/constants";

export class LeaveStorageService {
  private static _getFromStorage(): LeaveRequest[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEAVE_REQUESTS);
      if (!data) return [];
      return JSON.parse(data) as LeaveRequest[];
    } catch {
      return [];
    }
  }

  private static _saveToStorage(requests: LeaveRequest[]): void {
    localStorage.setItem(
      STORAGE_KEYS.LEAVE_REQUESTS,
      JSON.stringify(requests)
    );
    this.notifyChange();
  }

  private static notifyChange() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent(APP_EVENTS.DATA_CHANGE, {
        detail: STORAGE_KEYS.LEAVE_REQUESTS,
      })
    );
  }

  static getAll(): LeaveRequest[] {
    return this._getFromStorage();
  }

  static getById(id: string): LeaveRequest | undefined {
    return this._getFromStorage().find((r) => r.id === id);
  }

  static create(data: Omit<LeaveRequest, "id" | "status">): LeaveRequest {
    const requests = this._getFromStorage();
    const newRequest: LeaveRequest = {
      id: uuidv4(),
      status: "PENDING",
      ...data,
    };
    requests.push(newRequest);
    this._saveToStorage(requests);
    return newRequest;
  }

  static update(
    id: string,
    data: Omit<LeaveRequest, "id" | "status">
  ): LeaveRequest {
    const requests = this._getFromStorage();
    const index = requests.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Leave request with id ${id} not found`);
    }
    const updated: LeaveRequest = {
      ...requests[index],
      ...data,
    };
    requests[index] = updated;
    this._saveToStorage(requests);
    return updated;
  }

  static updateStatus(id: string, status: LeaveStatus): LeaveRequest {
    const requests = this._getFromStorage();
    const index = requests.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Leave request with id ${id} not found`);
    }
    requests[index] = { ...requests[index], status };
    this._saveToStorage(requests);
    return requests[index];
  }

  static delete(id: string): void {
    const requests = this._getFromStorage();
    this._saveToStorage(requests.filter((r) => r.id !== id));
  }

  static deleteByEmployeeId(employeeId: string): void {
    const requests = this._getFromStorage();
    const filtered = requests.filter((r) => r.employeeId !== employeeId);
    this._saveToStorage(filtered);
  }

  static getByEmployeeId(employeeId: string): LeaveRequest[] {
    return this._getFromStorage().filter(
      (r) => r.employeeId === employeeId
    );
  }

  static getByStatus(status: LeaveStatus): LeaveRequest[] {
    return this._getFromStorage().filter((r) => r.status === status);
  }

  static countByStatus(): {
    pending: number;
    approved: number;
    rejected: number;
  } {
    const all = this._getFromStorage();
    return {
      pending: all.filter((r) => r.status === "PENDING").length,
      approved: all.filter((r) => r.status === "APPROVED").length,
      rejected: all.filter((r) => r.status === "REJECTED").length,
    };
  }
}
