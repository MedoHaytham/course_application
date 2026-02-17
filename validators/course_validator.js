import { z } from 'zod';
const courseSchema = z.object({
  title: z.string().trim().min(2, "title at least is 2 chars"),
  price: z.number().min(1, "price is required")
});

export const validateCourse = (data) => {
  return courseSchema.safeParse(data);
};