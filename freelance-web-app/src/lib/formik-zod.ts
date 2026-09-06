import type { ZodType } from "zod";

/** Bridges a Zod schema into a Formik-compatible `validate` function. */
export function zodToFormikValidate<T>(schema: ZodType<T>) {
  return (values: T) => {
    const result = schema.safeParse(values);
    if (result.success) return {};

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (!errors[path]) errors[path] = issue.message;
    }
    return errors;
  };
}
