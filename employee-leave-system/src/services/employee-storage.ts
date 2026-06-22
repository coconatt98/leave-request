import { v4 as uuidv4 } from "uuid";
import { Employee } from "@/types/employee";
import { APP_EVENTS, STORAGE_KEYS } from "@/constants";
import { LeaveStorageService } from "@/services/leave-storage";

export class EmployeeStorageService {
  private static _getFromStorage(): Employee[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      if (!data) return [];
      return JSON.parse(data) as Employee[];
    } catch {
      return [];
    }
  }

  private static _saveToStorage(employees: Employee[]): void {
    localStorage.setItem(
      STORAGE_KEYS.EMPLOYEES,
      JSON.stringify(employees)
    );
    this.notifyChange();
  }

  private static notifyChange() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent(APP_EVENTS.DATA_CHANGE, {
        detail: STORAGE_KEYS.EMPLOYEES,
      })
    );
  }

  static getAll(): Employee[] {
    return this._getFromStorage();
  }

  static getById(id: string): Employee | undefined {
    const employees = this._getFromStorage();
    return employees.find((emp) => emp.id === id);
  }

  static create(data: Omit<Employee, "id">): Employee {
    const employees = this._getFromStorage();
    const newEmployee: Employee = {
      id: uuidv4(),
      ...data,
    };
    employees.push(newEmployee);
    this._saveToStorage(employees);
    return newEmployee;
  }

  static update(id: string, data: Omit<Employee, "id">): Employee {
    const employees = this._getFromStorage();
    const index = employees.findIndex((emp) => emp.id === id);
    if (index === -1) {
      throw new Error(`Employee with id ${id} not found`);
    }
    const updatedEmployee: Employee = { id, ...data };
    employees[index] = updatedEmployee;
    this._saveToStorage(employees);
    return updatedEmployee;
  }

  static delete(id: string): void {
    const employees = this._getFromStorage();
    const filtered = employees.filter((emp) => emp.id !== id);
    this._saveToStorage(filtered);
    LeaveStorageService.deleteByEmployeeId(id);
  }

  static search(query: string): Employee[] {
    const employees = this._getFromStorage();
    const lowerQuery = query.toLowerCase();
    return employees.filter((emp) =>
      emp.name.toLowerCase().includes(lowerQuery)
    );
  }
}
