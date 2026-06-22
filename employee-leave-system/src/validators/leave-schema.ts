import { z } from "zod";

export const leaveSchema = z
  .object({
    employeeId: z.string().min(1, "Employee is required"),
    startDate: z.string().min(1, "Start date is required").refine((val) => {
      const start = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return start > today;
    }, {
      message: "Start date must be after today",
    }),
    endDate: z.string().min(1, "End date is required"),
    reason: z
      .string()
      .min(1, "Reason is required")
      .max(500, "Reason must be at most 500 characters"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type LeaveFormData = z.infer<typeof leaveSchema>;
