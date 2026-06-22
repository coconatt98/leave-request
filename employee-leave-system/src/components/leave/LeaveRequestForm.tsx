"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formSectionClass } from "@/components/shared/telkomselStyles";
import { leaveSchema, type LeaveFormData } from "@/validators/leave-schema";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/hooks/useAuth";

type LeaveRequestFormProps = {
  onSubmit: (data: LeaveFormData) => void;
  defaultValues?: LeaveFormData;
  isLoading?: boolean;
  isReadOnly?: boolean;
};

export function LeaveRequestForm({
  onSubmit,
  defaultValues,
  isLoading = false,
  isReadOnly = false,
}: LeaveRequestFormProps) {
  const router = useRouter();
  const { employees } = useEmployees();
  const { role, username } = useAuth();

  const filteredEmployees = employees.filter((emp) => {
    if (role === "INPUTTER") {
      return emp.username === username;
    }
    return true;
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  // Auto-select if there's only one employee option (e.g., for INPUTTER)
  useEffect(() => {
    const currentVal = control._formValues.employeeId;
    if (filteredEmployees.length === 1 && !currentVal) {
      reset((prev) => ({ ...prev, employeeId: filteredEmployees[0].id }));
    }
  }, [filteredEmployees, control, reset]);

  const isDisabled = isLoading || isReadOnly;
  const submitLabel = isReadOnly
    ? "Request Locked"
    : isLoading
      ? "Submitting..."
      : "Submit Request";

  const fieldClasses =
    "border-[rgba(255,90,95,0.35)] bg-[#2b2b2d] text-white placeholder:text-[#7b7b81] focus-visible:border-[#ff4d57] focus-visible:ring-[#ff949a]/40 disabled:bg-[#1a1a1c]";

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const startDateValue = watch("startDate");
  const endDateMin = startDateValue || minDate;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl space-y-4 rounded-2xl border border-[rgba(255,90,95,0.35)] bg-[#1a1a1c] p-6 shadow-[0_18px_40px_rgba(255,77,87,0.12)]"
    >
      {/* Employee Select */}
      <div className={formSectionClass}>
        <Label
          htmlFor="employeeId"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-white"
        >
          Employee
        </Label>
        <Controller
          name="employeeId"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value ?? ""}
              disabled={isDisabled}
            >
              <SelectTrigger
                id="employeeId"
                disabled={isDisabled}
                className={fieldClasses}
                aria-describedby={
                  errors.employeeId ? "employeeId-error" : undefined
                }
              >
                <SelectValue placeholder="Select an employee">
                  {field.value && filteredEmployees.length > 0
                    ? (() => {
                        const selected = filteredEmployees.find((e) => e.id === field.value);
                        return selected ? `${selected.name} — ${selected.position}` : field.value;
                      })()
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {filteredEmployees.length === 0 ? (
                  <SelectItem value="__empty__" disabled>
                    No employees available
                  </SelectItem>
                ) : (
                  filteredEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} — {emp.position}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />
        {errors.employeeId && (
          <p id="employeeId-error" className="text-sm text-[#ff949a]">
            {errors.employeeId.message}
          </p>
        )}
      </div>

      {/* Start Date */}
      <div className={formSectionClass}>
        <Label
          htmlFor="startDate"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-white"
        >
          Start Date
        </Label>
        <Input
          id="startDate"
          type="date"
          disabled={isDisabled}
          min={minDate}
          className={fieldClasses}
          {...register("startDate")}
          aria-describedby={errors.startDate ? "startDate-error" : undefined}
        />
        {errors.startDate && (
          <p id="startDate-error" className="text-sm text-[#ff949a]">
            {errors.startDate.message}
          </p>
        )}
      </div>

      {/* End Date */}
      <div className={formSectionClass}>
        <Label
          htmlFor="endDate"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-white"
        >
          End Date
        </Label>
        <Input
          id="endDate"
          type="date"
          disabled={isDisabled}
          min={endDateMin}
          className={fieldClasses}
          {...register("endDate")}
          aria-describedby={errors.endDate ? "endDate-error" : undefined}
        />
        {errors.endDate && (
          <p id="endDate-error" className="text-sm text-[#ff949a]">
            {errors.endDate.message}
          </p>
        )}
      </div>

      {/* Reason */}
      <div className={formSectionClass}>
        <Label
          htmlFor="reason"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-white"
        >
          Reason
        </Label>
        <Textarea
          id="reason"
          placeholder="Describe the reason for leave..."
          rows={4}
          disabled={isDisabled}
          className={`${fieldClasses} min-h-[120px]`}
          {...register("reason")}
          aria-describedby={errors.reason ? "reason-error" : undefined}
        />
        {errors.reason && (
          <p id="reason-error" className="text-sm text-[#ff949a]">
            {errors.reason.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button type="submit" disabled={isDisabled}>
          {submitLabel}
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
