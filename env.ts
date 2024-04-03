import { z } from "zod";

export const ENV_SCHEMA = z.object({
  API_KEY: z.string(),
  APP_ID: z.string(),
  INDEX_NAME: z.string(),
} as const);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof ENV_SCHEMA> {}
  }
}

export const ENV_VARIABLES = ENV_SCHEMA.parse(process.env);
