"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formSectionClass } from "@/components/shared/telkomselStyles";
import { employeeSchema, type EmployeeFormData } from "@/validators/employee-schema";

type EmployeeFormProps = {
  defaultValues?: EmployeeFormData;
  onSubmit: (data: EmployeeFormData) => void;
  isLoading?: boolean;
};

export function EmployeeForm({
  defaultValues,
  onSubmit,
  isLoading = false,
}: EmployeeFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const currentPosition = watch("position");
  const currentRole = watch("role");

  useEffect(() => {
    if (currentPosition !== "Manager" && currentRole === "APPROVER") {
      setValue("role", "INPUTTER");
    }
  }, [currentPosition, currentRole, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg space-y-4 rounded-2xl border border-[rgba(255,90,95,0.35)] bg-[#1a1a1c] p-6 shadow-[0_18px_40px_rgba(255,77,87,0.12)]"
    >
      {/* Name */}
      <div className={formSectionClass}>
        <Label
          htmlFor="name"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-white"
        >
          Full Name
        </Label>
        <Input
          id="name"
          placeholder="e.g. John Doe"
          className="border-[rgba(255,90,95,0.35)] bg-[#2b2b2d] text-white placeholder:text-[#7b7b81] focus-visible:border-[#ff4d57] focus-visible:ring-[#ff949a]/40"
          {...register("name")}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-[#ff949a]">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Department */}
      <div className={formSectionClass}>
        <Label
          htmlFor="department"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-white"
        >
          Department
        </Label>
        <Input
          id="department"
          placeholder="e.g. Engineering"
          className="border-[rgba(255,90,95,0.35)] bg-[#2b2b2d] text-white placeholder:text-[#7b7b81] focus-visible:border-[#ff4d57] focus-visible:ring-[#ff949a]/40"
          {...register("department")}
          aria-describedby={errors.department ? "department-error" : undefined}
        />
        {errors.department && (
          <p id="department-error" className="text-sm text-[#ff949a]">
            {errors.department.message}
          </p>
        )}
      </div>

      {/* Position */}
      <div className={formSectionClass}>
        <Label
          htmlFor="position"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-white"
        >
          Position
        </Label>
        <select
          id="position"
          className="flex h-9 w-full rounded-md border border-[rgba(255,90,95,0.35)] bg-[#2b2b2d] px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:border-[#ff4d57] focus-visible:ring-1 focus-visible:ring-[#ff949a]/40"
          {...register("position")}
          aria-describedby={errors.position ? "position-error" : undefined}
        >
          <option value="">Select a position</option>
          <option value="Developer">Developer</option>
          <option value="Team Lead">Team Lead</option>
          <option value="Manager">Manager</option>
        </select>
        {errors.position && (
          <p id="position-error" className="text-sm text-[#ff949a]">
            {errors.position.message}
          </p>
        )}
      </div>

      {/* Role */}
      <div className={formSectionClass}>
        <Label
          htmlFor="role"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-white"
        >
          Role
        </Label>
        <select
          id="role"
          className="flex h-9 w-full rounded-md border border-[rgba(255,90,95,0.35)] bg-[#2b2b2d] px-3 py-1 text-sm text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:border-[#ff4d57] focus-visible:ring-1 focus-visible:ring-[#ff949a]/40"
          {...register("role")}
          aria-describedby={errors.role ? "role-error" : undefined}
        >
          <option value="INPUTTER">Inputter</option>
          <option value="APPROVER" disabled={currentPosition !== "Manager"}>Approver</option>
          <option value="ADMIN">Admin</option>
        </select>
        {errors.role && (
          <p id="role-error" className="text-sm text-[#ff949a]">
            {errors.role.message}
          </p>
        )}
      </div>

      {/* Username */}
      <div className={formSectionClass}>
        <Label
          htmlFor="username"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-white"
        >
          Username
        </Label>
        <Input
          id="username"
          placeholder="e.g. johndoe"
          className="border-[rgba(255,90,95,0.35)] bg-[#2b2b2d] text-white placeholder:text-[#7b7b81] focus-visible:border-[#ff4d57] focus-visible:ring-[#ff949a]/40"
          {...register("username")}
          aria-describedby={errors.username ? "username-error" : undefined}
        />
        {errors.username && (
          <p id="username-error" className="text-sm text-[#ff949a]">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className={formSectionClass}>
        <Label
          htmlFor="password"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-white"
        >
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          className="border-[rgba(255,90,95,0.35)] bg-[#2b2b2d] text-white placeholder:text-[#7b7b81] focus-visible:border-[#ff4d57] focus-visible:ring-[#ff949a]/40"
          {...register("password")}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-[#ff949a]">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isLoading}
          className="text-sm text-white"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
