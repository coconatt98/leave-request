# Employee Leave Management System – Code Review

**Spec Reference:** `Mini_Project_Specification_Employee_Leave_System.md` (Dashboard requirements §80-85, Leave module §§157-195, Challenge 4 §284-291)

## Summary
The implementation covers most navigation and basic CRUD flows, but several blocking gaps remain versus the workshop spec. Authentication can be bypassed with a single `localStorage` assignment, leave management lacks full CRUD, dashboard statistics do not refresh after mutations, and shared state such as authentication is duplicated per component. These issues warrant changes before shipping.

## Review Matrix
| Area | Status | Severity | Finding | Recommendation |
| --- | --- | --- | --- | --- |
| Functional Correctness | FAIL | High | Leave request CRUD is incomplete and employee deletions leave orphaned leave records. | Add edit/delete flows for leave requests and cascade/validate employee deletions. |
| Security | FAIL | High | Auth relies solely on the existence of a mutable `localStorage` key, allowing login bypass without credentials. | Sign sessions and verify credentials on each privileged action instead of trusting client-modifiable storage. |
| Performance | FAIL | Medium | Dashboard metrics load once and never refresh, violating the "real-time count" requirement. | Recompute stats whenever employee/leave data changes (e.g., via shared store or storage events). |
| Maintainability | FAIL | Medium | Authentication state is duplicated across components via `useAuth`, causing inconsistent UI/rendering paths. | Provide a single auth context/provider so all consumers read the same state. |
| Other Areas (Type Safety, Validation, UI/UX, Dependencies) | PASS | Low | No blocking issues observed during this pass. | Continue standard checks during future iterations. |

## Detailed Findings
### 1. Security – Client-side auth can be bypassed (High)
`AuthStorageService.isAuthenticated()` only checks whether the `authSession` key exists in `localStorage`; it does not inspect its contents or signature (`src/services/auth-storage.ts:31-42`). `AuthenticatedLayout` trusts that boolean to render every protected route (`src/app/(authenticated)/layout.tsx:18-29`). An attacker can open DevTools on `/login`, run `localStorage.setItem("authSession", "{}")`, refresh, and instantly gain access without knowing the password. **Recommendation:** derive authentication state from validated credentials, sign session payloads (e.g., HMAC) so tampering can be detected, and gate privileged mutations behind a shared auth context or middleware.

### 2. Functional – Leave Request CRUD is incomplete (High)
Challenge 4 requires full leave-request CRUD plus approval workflow (`Mini_Project_Specification_Employee_Leave_System.md:284-291`). The UI only offers listing (`src/app/(authenticated)/leave/page.tsx:19-87`) and creation (`src/app/(authenticated)/leave/new/page.tsx:11-39`). There is no page or component to edit or delete existing requests even though `LeaveStorageService.delete` exists (`src/services/leave-storage.ts:55-58`). Users cannot correct or remove erroneous requests, so the spec is unmet. **Recommendation:** add `/leave/edit/[id]` and delete actions, wiring them to `LeaveStorageService` and reusing the `LeaveRequestForm` with default values.

### 3. Functional – Employee deletion leaves orphan leave records (Medium)
When an employee is deleted, only the employee list is filtered (`src/services/employee-storage.ts:56-60`). Existing leave entries referencing that employee remain untouched and later render as "Unknown" because `LeaveRequestTable` builds its employee map once from the remaining employees (`src/components/leave/LeaveRequestTable.tsx:34-41, 80-99`). This violates the data-integrity expectation in the spec's Leave module (§§157-195). **Recommendation:** either prevent deletion while pending leave exists, or cascade the deletion through `LeaveStorageService` (e.g., `deleteByEmployeeId`). Update the table effect to rebuild the employee map whenever leave data changes.

### 4. Performance – Dashboard stats never refresh (Medium)
The dashboard loads employee counts and leave aggregates exactly once inside a `useEffect` with an empty dependency array (`src/app/(authenticated)/dashboard/page.tsx:18-30`), even though the spec explicitly calls for "Real-time count from Local Storage" (`Mini_Project_Specification_Employee_Leave_System.md:80-85`). After adding or approving records, the cards stay stale until the user hard-refreshes the browser. **Recommendation:** move employee/leave data into shared hooks that expose change notifications, subscribe to the `storage` event, or recompute stats whenever `EmployeeStorageService`/`LeaveStorageService` mutates.

### 5. Maintainability – Auth state duplicated per component (Medium)
`useAuth` holds local `useState` flags each time it is invoked (`src/hooks/useAuth.ts:7-35`). Components like `Navbar` and `AuthenticatedLayout` instantiate their own copies, leading to momentary inconsistencies (e.g., the navbar avatar/log-out button does not reflect the login result until its own effect re-reads `localStorage`; see `src/components/shared/Navbar.tsx:17-96`). Having multiple, unsynchronized sources of truth makes it harder to extend auth (e.g., role-based access) and complicates testing. **Recommendation:** wrap the app in an `AuthProvider` context that keeps a single state machine, exposing `useAuthContext()` to consumers so they stay synchronized.

## Final Recommendation
**Status:** REQUEST CHANGES

| Severity | Count |
| --- | --- |
| Critical | 0 |
| High | 3 |
| Medium | 2 |
| Low | 0 |

Address the high-severity gaps (auth bypass and missing leave CRUD) plus the medium issues before proceeding to additional features or refactors.