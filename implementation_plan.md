# Employee Leave Management System — Implementation Plan

## Overview

Membangun aplikasi web monolitik menggunakan **Next.js App Router** untuk mengelola data karyawan dan pengajuan cuti. Aplikasi berjalan sepenuhnya di browser dengan **Local Storage** sebagai penyimpanan data (tanpa backend/database).

### Tech Stack
| Technology | Purpose |
|---|---|
| Next.js App Router | Routing & SSR framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| ShadCN UI | UI component library |
| React Hook Form | Form management |
| Zod | Schema validation |
| Local Storage | Data persistence |

---

## Open Questions

> [!IMPORTANT]
> Beberapa pertanyaan yang perlu dijawab sebelum implementasi:

1. **Apakah project akan di-inisialisasi di folder baru** (misalnya `D:\Project\Training\VIBECODING\employee-leave-system`) **atau langsung di root workspace** `D:\Project\Training\VIBECODING`?
2. **Versi Next.js**: Apakah menggunakan Next.js versi terbaru (15.x) atau ada preferensi versi tertentu?
3. **Theme**: Apakah ada preferensi warna/tema tertentu untuk UI (dark mode, light mode, atau keduanya)?
4. **Bahasa UI**: Apakah UI dalam Bahasa Indonesia atau English?

---

## Proposed Changes

Implementasi dibagi menjadi **6 Phase** sesuai dengan workshop challenges di spesifikasi.

---

### Phase 1 — Project Setup, Types & Validation Schemas

> Fondasi project: inisialisasi Next.js, install dependencies, definisikan types dan validation schemas.

#### 1.1 — Inisialisasi Project

##### [NEW] Project initialization
- Jalankan `npx -y create-next-app@latest ./` dengan opsi:
  - TypeScript ✅
  - Tailwind CSS ✅
  - App Router ✅
  - ESLint ✅
  - `src/` directory ✅
- Install ShadCN UI: `npx -y shadcn@latest init`
- Install dependencies:
  - `react-hook-form`
  - `@hookform/resolvers`
  - `zod`
  - `uuid` + `@types/uuid`
  - `lucide-react` (icon library untuk ShadCN)

#### 1.2 — Folder Structure Setup

##### [NEW] Folder structure
Buat seluruh folder structure sesuai spec:

```text
src/
├── app/
│   ├── login/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── employees/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── edit/
│   │       └── [id]/
│   │           └── page.tsx
│   ├── leave/
│   │   ├── page.tsx
│   │   └── new/
│   │       └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx              ← redirect ke /login
│   └── globals.css
│
├── components/
│   ├── dashboard/
│   │   └── StatCard.tsx
│   ├── employee/
│   │   ├── EmployeeForm.tsx
│   │   ├── EmployeeTable.tsx
│   │   └── EmployeeDeleteDialog.tsx
│   ├── leave/
│   │   ├── LeaveRequestForm.tsx
│   │   ├── LeaveRequestTable.tsx
│   │   └── LeaveStatusBadge.tsx
│   ├── shared/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── PageHeader.tsx
│   │   └── ConfirmDialog.tsx
│   └── ui/                   ← ShadCN generated components
│
├── services/
│   ├── auth-storage.ts
│   ├── employee-storage.ts
│   └── leave-storage.ts
│
├── types/
│   ├── employee.ts
│   └── leave.ts
│
├── validators/
│   ├── employee-schema.ts
│   └── leave-schema.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useEmployees.ts
│   ├── useLeaveRequests.ts
│   └── useLocalStorage.ts
│
├── lib/
│   └── utils.ts              ← ShadCN utility (cn function)
│
└── constants/
    └── index.ts
```

#### 1.3 — Type Definitions

##### [NEW] `src/types/employee.ts`
```typescript
export type Employee = {
  id: string;
  name: string;
  department: string;
  position: string;
};
```

##### [NEW] `src/types/leave.ts`
```typescript
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export type LeaveRequest = {
  id: string;
  employeeId: string;
  startDate: string;    // ISO date string
  endDate: string;      // ISO date string
  reason: string;
  status: LeaveStatus;
};
```

#### 1.4 — Zod Validation Schemas

##### [NEW] `src/validators/employee-schema.ts`
- Field `name`: string, required, min 3 karakter, dengan pesan error kustom
- Field `department`: string, required, min 1 karakter
- Field `position`: string, required, min 1 karakter
- Export type `EmployeeFormData` via `z.infer`

##### [NEW] `src/validators/leave-schema.ts`
- Field `employeeId`: string, required
- Field `startDate`: string, required, validasi format tanggal
- Field `endDate`: string, required, validasi format tanggal
- Field `reason`: string, required, min 1 karakter
- Custom validation (`.refine`): `endDate > startDate`
- Export type `LeaveFormData` via `z.infer`

#### 1.5 — Constants

##### [NEW] `src/constants/index.ts`
- `STORAGE_KEYS`: object berisi key-key localStorage (`employees`, `leaveRequests`, `authSession`)
- `CREDENTIALS`: `{ username: "admin", password: "admin123" }`
- `LEAVE_STATUS`: enum-like object `{ PENDING, APPROVED, REJECTED }`
- `NAV_ITEMS`: array of navigation item objects `{ label, href, icon }`

---

### Phase 2 — Authentication & Navigation

> Login page, auth service, route protection, dan navigation menu.

#### 2.1 — Auth Storage Service

##### [NEW] `src/services/auth-storage.ts`
- `login(username: string, password: string): boolean` — validasi credentials, simpan session ke localStorage
- `logout(): void` — hapus session dari localStorage
- `isAuthenticated(): boolean` — cek apakah ada session valid di localStorage
- `getSession(): AuthSession | null` — ambil data session

#### 2.2 — Auth Hook

##### [NEW] `src/hooks/useAuth.ts`
- Custom hook yang wraps auth service
- Return: `{ isAuthenticated, login, logout, isLoading }`
- Handle redirect ke `/login` jika belum authenticated
- Handle redirect ke `/dashboard` jika sudah authenticated (untuk halaman login)

#### 2.3 — ShadCN UI Components

Install ShadCN components yang diperlukan:
```bash
npx shadcn@latest add button card input label form table badge dialog toast dropdown-menu select separator sheet
```

#### 2.4 — Login Page

##### [NEW] `src/app/login/page.tsx`
- Form dengan fields: Username, Password
- Validasi client-side menggunakan React Hook Form + Zod
- Tampilkan error message jika login gagal
- Redirect ke `/dashboard` setelah login berhasil
- UI: Card centered di tengah layar, branding/logo di atas

#### 2.5 — Navigation Components

##### [NEW] `src/components/shared/Navbar.tsx`
- Top navigation bar
- Logo/App name di kiri
- User info + Logout button di kanan
- Responsive: hamburger menu di mobile

##### [NEW] `src/components/shared/Sidebar.tsx`
- Side navigation untuk desktop
- Menu items: Dashboard, Employees, Leave Requests
- Active state indicator untuk current route
- Collapsible di mobile (menggunakan Sheet dari ShadCN)

#### 2.6 — Layout

##### [MODIFY] `src/app/layout.tsx`
- Setup root layout dengan Toaster provider
- Meta tags & SEO dasar

##### [NEW] `src/app/(authenticated)/layout.tsx`
- Layout group untuk halaman yang perlu auth
- Include Navbar + Sidebar
- Auth guard: redirect ke `/login` jika belum auth
- Wrapper content area yang responsive

##### [NEW] `src/app/page.tsx`
- Root page: redirect ke `/login`

---

### Phase 3 — Dashboard

> Halaman dashboard dengan statistik cards.

#### 3.1 — Dashboard Page

##### [NEW] `src/app/dashboard/page.tsx`
- Judul halaman "Dashboard"
- Grid layout 2x2 (mobile: 1 kolom, desktop: 4 kolom)
- 4 StatCard components:
  1. **Total Employees** — hitung dari localStorage employees
  2. **Pending Leave Requests** — filter status = PENDING
  3. **Approved Leave Requests** — filter status = APPROVED
  4. **Rejected Leave Requests** — filter status = REJECTED
- Data diambil real-time dari localStorage via service layer

#### 3.2 — StatCard Component

##### [NEW] `src/components/dashboard/StatCard.tsx`
- Props: `title`, `value`, `icon`, `color/variant`
- Menggunakan ShadCN Card
- Tampilkan ikon, judul, dan angka statistik
- Warna berbeda per status (e.g., pending=kuning, approved=hijau, rejected=merah)

---

### Phase 4 — Employee CRUD

> Fitur lengkap Create, Read, Update, Delete untuk data karyawan.

#### 4.1 — Employee Storage Service

##### [NEW] `src/services/employee-storage.ts`
- `getAll(): Employee[]` — ambil semua employee dari localStorage
- `getById(id: string): Employee | undefined` — ambil 1 employee by id
- `create(data: Omit<Employee, 'id'>): Employee` — buat employee baru, generate UUID
- `update(id: string, data: Omit<Employee, 'id'>): Employee` — update employee
- `delete(id: string): void` — hapus employee
- `search(query: string): Employee[]` — search by name (case-insensitive)
- Semua operasi read/write via helper functions yang parse/stringify JSON dari/ke localStorage
- Error handling untuk data corrupt atau localStorage penuh

#### 4.2 — Employee Hook

##### [NEW] `src/hooks/useEmployees.ts`
- Custom hook untuk manage state employee
- Return: `{ employees, isLoading, createEmployee, updateEmployee, deleteEmployee, searchEmployees, refreshEmployees }`
- State management dengan `useState` + service calls
- Auto-refresh setelah mutasi

#### 4.3 — Employee List Page

##### [NEW] `src/app/employees/page.tsx`
- PageHeader dengan judul "Employees" dan tombol "Add Employee" (link ke `/employees/new`)
- Search bar (input field) untuk filter by name
- EmployeeTable component
- Loading state
- Empty state jika belum ada data

#### 4.4 — Employee Table Component

##### [NEW] `src/components/employee/EmployeeTable.tsx`
- ShadCN Table component
- Columns: No, Name, Department, Position, Actions
- Actions per row: Edit (link ke `/employees/edit/[id]`), Delete (open confirm dialog)
- Responsive: di mobile tampilkan sebagai card list, bukan table
- Empty state message

#### 4.5 — Employee Delete Dialog

##### [NEW] `src/components/employee/EmployeeDeleteDialog.tsx`
- ShadCN Dialog/AlertDialog
- Konfirmasi sebelum delete: "Are you sure you want to delete [name]?"
- Tombol Cancel dan Delete
- Setelah delete berhasil: tampilkan Toast notification, refresh list
- **Validasi**: Cek apakah employee memiliki leave request terkait, tampilkan warning jika ada

#### 4.6 — Employee Form Component

##### [NEW] `src/components/employee/EmployeeForm.tsx`
- Reusable form untuk Create dan Edit
- Props: `defaultValues?` (untuk mode edit), `onSubmit`, `isLoading`
- Menggunakan React Hook Form + Zod resolver
- Fields:
  - Name (Input) — min 3 karakter
  - Department (Input atau Select)
  - Position (Input)
- Validation error messages di bawah setiap field
- Submit button disabled saat processing
- Cancel button (navigate back)

#### 4.7 — Create Employee Page

##### [NEW] `src/app/employees/new/page.tsx`
- PageHeader "Add New Employee"
- Render EmployeeForm tanpa defaultValues
- Setelah submit: simpan via service, tampilkan toast, redirect ke `/employees`

#### 4.8 — Edit Employee Page

##### [NEW] `src/app/employees/edit/[id]/page.tsx`
- Ambil `id` dari route params
- Load employee data dari service
- Handle case employee not found (redirect atau tampilkan error)
- Render EmployeeForm dengan defaultValues dari data existing
- Setelah submit: update via service, tampilkan toast, redirect ke `/employees`

---

### Phase 5 — Leave Request CRUD & Approval Workflow

> Fitur lengkap pengajuan cuti dan approval/rejection.

#### 5.1 — Leave Storage Service

##### [NEW] `src/services/leave-storage.ts`
- `getAll(): LeaveRequest[]` — ambil semua leave requests
- `getById(id: string): LeaveRequest | undefined` — ambil 1 by id
- `create(data: Omit<LeaveRequest, 'id' | 'status'>): LeaveRequest` — buat request baru, default status = PENDING
- `updateStatus(id: string, status: LeaveStatus): LeaveRequest` — approve atau reject
- `delete(id: string): void` — hapus leave request
- `getByEmployeeId(employeeId: string): LeaveRequest[]` — ambil berdasarkan employee
- `getByStatus(status: LeaveStatus): LeaveRequest[]` — filter by status
- `countByStatus(): { pending: number, approved: number, rejected: number }` — untuk dashboard

#### 5.2 — Leave Request Hook

##### [NEW] `src/hooks/useLeaveRequests.ts`
- Custom hook untuk manage state leave requests
- Return: `{ leaveRequests, isLoading, createLeaveRequest, approveRequest, rejectRequest, filterByStatus, refreshLeaveRequests }`
- State management + service calls
- Filter state untuk status filtering

#### 5.3 — Leave Request List Page

##### [NEW] `src/app/leave/page.tsx`
- PageHeader "Leave Requests" + tombol "New Request" (link ke `/leave/new`)
- Status filter tabs/dropdown: All, Pending, Approved, Rejected
- LeaveRequestTable component
- Loading state & empty state

#### 5.4 — Leave Request Table Component

##### [NEW] `src/components/leave/LeaveRequestTable.tsx`
- ShadCN Table
- Columns: No, Employee Name, Start Date, End Date, Reason, Status, Actions
- Employee Name di-resolve dari employee service (join by employeeId)
- Actions per row:
  - Jika status PENDING: tombol Approve ✅ dan Reject ❌
  - Jika status APPROVED/REJECTED: tidak ada action (atau tampilkan status saja)
- Confirm dialog sebelum approve/reject
- Toast notification setelah action berhasil
- Responsive card layout di mobile

#### 5.5 — Leave Status Badge Component

##### [NEW] `src/components/leave/LeaveStatusBadge.tsx`
- Props: `status: LeaveStatus`
- ShadCN Badge dengan warna berbeda:
  - PENDING → kuning/warning
  - APPROVED → hijau/success
  - REJECTED → merah/destructive

#### 5.6 — Leave Request Form Component

##### [NEW] `src/components/leave/LeaveRequestForm.tsx`
- React Hook Form + Zod
- Fields:
  - Employee (Select/Dropdown — load dari employee service)
  - Start Date (Date picker atau input type="date")
  - End Date (Date picker atau input type="date")
  - Reason (Textarea)
- Validation:
  - Semua field required
  - End Date > Start Date (custom Zod refine)
  - Tampilkan error jika ada employee belum dipilih
- Submit button disabled saat processing
- Cancel button

#### 5.7 — Create Leave Request Page

##### [NEW] `src/app/leave/new/page.tsx`
- PageHeader "New Leave Request"
- Render LeaveRequestForm
- Setelah submit: simpan via service (status=PENDING), toast, redirect ke `/leave`

---

### Phase 6 — Code Review & Refactoring

> Review dan perbaikan kode sesuai acceptance criteria.

#### 6.1 — Security Review

Cek dan perbaiki:
- **XSS Prevention**: Pastikan tidak ada `dangerouslySetInnerHTML` atau raw user input rendering
- **Input Sanitization**: Semua input di-escape dan divalidasi melalui Zod
- **Auth Guard**: Pastikan semua route protected, tidak bisa di-bypass via URL langsung
- **localStorage Security**: Pastikan credential tidak disimpan dalam plain text yang mudah diakses (atau minimal di-note bahwa ini demo)

#### 6.2 — Performance Review

Cek dan perbaiki:
- **Unnecessary Re-renders**: Gunakan `React.memo`, `useMemo`, `useCallback` di tempat yang tepat
- **localStorage Access**: Jangan panggil `localStorage.getItem/setItem` berlebihan, cache di state
- **Component Splitting**: Pastikan tidak ada component yang terlalu besar
- **"use client"** directive: Gunakan hanya di component yang benar-benar butuh client-side interactivity

#### 6.3 — Maintainability Review

Cek dan perbaiki:
- **Code Duplication**: Extract common patterns ke shared components/hooks
- **Consistent Naming**: Pastikan konsisten dengan naming convention di Project Rules
- **Error Handling**: Tambahkan error boundary dan graceful error handling
- **Type Safety**: Pastikan tidak ada `any` type, gunakan strict TypeScript
- **Unused Imports**: Bersihkan semua unused imports

#### 6.4 — Responsiveness & Accessibility

- Test responsive di breakpoint: mobile (375px), tablet (768px), desktop (1280px)
- Pastikan semua interactive elements punya keyboard accessibility
- Tambahkan `aria-label` pada tombol ikon
- Pastikan contrast ratio memenuhi WCAG AA

---

## Verification Plan

### Automated Tests

```bash
# Build check - pastikan tidak ada TypeScript / build errors
npm run build

# Lint check
npm run lint

# Dev server check
npm run dev
```

### Manual Verification

| # | Test Case | Expected Result |
|---|---|---|
| 1 | Akses `/login`, login dengan `admin`/`admin123` | Redirect ke `/dashboard` |
| 2 | Login dengan credential salah | Error message muncul |
| 3 | Akses `/dashboard` tanpa login | Redirect ke `/login` |
| 4 | Dashboard menampilkan 4 stat cards | Angka sesuai data di localStorage |
| 5 | Buat employee baru | Employee tersimpan, redirect ke list |
| 6 | Edit employee | Data ter-update |
| 7 | Hapus employee | Employee terhapus dari list |
| 8 | Search employee by name | List terfilter sesuai query |
| 9 | Buat leave request | Request tersimpan dengan status PENDING |
| 10 | Approve leave request | Status berubah jadi APPROVED |
| 11 | Reject leave request | Status berubah jadi REJECTED |
| 12 | Filter leave by status | Hanya tampilkan sesuai filter |
| 13 | Validasi form employee (name < 3 char) | Error message muncul |
| 14 | Validasi leave (end date < start date) | Error message muncul |
| 15 | Test responsive di mobile | Layout beradaptasi |
| 16 | Logout | Session terhapus, redirect ke `/login` |
| 17 | Refresh browser setelah input data | Data masih ada (persisted di localStorage) |

---

## Execution Summary

| Phase | Deskripsi | Estimasi File |
|---|---|---|
| Phase 1 | Setup, Types, Validators, Constants | ~10 files |
| Phase 2 | Auth, Navigation, Layout | ~8 files |
| Phase 3 | Dashboard | ~3 files |
| Phase 4 | Employee CRUD | ~8 files |
| Phase 5 | Leave Request CRUD + Approval | ~7 files |
| Phase 6 | Review & Refactoring | Modifikasi existing files |
| **Total** | | **~36+ files** |

> [!IMPORTANT]
> Plan ini mengasumsikan project baru akan di-inisialisasi di subfolder workspace. Mohon konfirmasi open questions di atas sebelum memulai eksekusi.
