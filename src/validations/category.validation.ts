import zod, {z} from "zod";

const CategoryDTO = zod.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  departmentId: z.number().int().positive("Department ID must be a positive integer")
});

export { CategoryDTO };