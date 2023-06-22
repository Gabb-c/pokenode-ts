import z from "zod";

const envSchema = z.object({
  API_KEY: z.string(),
  APP_ID: z.string(),
  INDEX_NAME: z.string(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const getEnvIssues = (): z.ZodIssue[] | void => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) return result.error.issues;
};

export const ENV = envSchema.parse(process.env);
