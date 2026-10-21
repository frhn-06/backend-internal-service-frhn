import zod, {z} from "zod";

const CategoryDTO = zod.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.preprocess((value) => {
      if(typeof value === "string" && value.trim() === "") {
          return null;
      }
      return value
  }, z.string().nullable().optional()),
  departmentId: z.number().int().positive("Department ID must be a positive integer")
});

export { CategoryDTO };