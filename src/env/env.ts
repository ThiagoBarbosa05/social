import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),
  CLOUDFARE_URL: z.string().url(),
  CLOUDFARE_ACCESS_KEY_ID: z.string(),
  CLOUDFARE_SECRET_ACCESS_KEY: z.string(),
})

export type Env = z.infer<typeof envSchema>
