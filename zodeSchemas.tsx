import z from "zod";

export const formSchema = z.object({
  company_name: z
    .string()
    .min(5, "Company name must be at least 5 characters.")
    .max(100, "Company name must be at most 100 characters."),
  receipt_number: z
    .number()
    .min(1, "Receipt number must be a positive integer."),
  receipt_type: z.enum([
    "امر مباشر",
    "مناقصة",
    "محضر اثبات حالة",
    "عينة بدون قيمة",
    "نقداً",
  ]),
  supply_order_number: z
    .number()
    .min(0, "Supply order number must be a positive integer or zero.."),
  item: z
    .string()
    .min(3, "Item must be at least 3 characters.")
    .max(50, "Item must be at most 50 characters."),
  technical_opinion: z.enum(["مقبول", "مرفوض"]),
  rejection_reason: z
    .string()
    .min(0, "Rejection reason must be at least 10 characters.")
    .max(300, "Rejection reason must be at most 300 characters."),
  dispensing_unit: z.enum(["عدد", "كيلو", "لتر"]),
  quantity: z.number().min(1, "Quantity must be a positive number."),
  Date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format.",
  }),
});

export const addCompanySchema = z.object({
  Name: z.string().min(2, "Name must be at least 2 characters"),
});
