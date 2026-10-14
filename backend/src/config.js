// Parse and validate required environment variables once so invalid deployments fail during startup.
import 'dotenv/config';
import { z } from 'zod';
const env=z.object({DATABASE_URL:z.string().url(),SESSION_SECRET:z.string().min(32),OTP_SECRET:z.string().min(32),FRONTEND_URL:z.string().url(),CORS_ALLOWED_ORIGINS:z.string().min(1),MAIL_HOST:z.string().min(1),MAIL_PORT:z.coerce.number().int(),MAIL_USERNAME:z.string().min(1),MAIL_PASSWORD:z.string().min(1),MAIL_FROM_ADDRESS:z.string().email(),COMPANY_NOTIFICATION_EMAIL:z.string().email(),STORAGE_TYPE:z.enum(['local','s3']).default('local')}).parse(process.env);
export const config={...env,production:process.env.NODE_ENV==='production',origins:env.CORS_ALLOWED_ORIGINS.split(',').map(x=>x.trim()),port:Number(process.env.PORT||4000)};
if(config.production && config.origins.some(x=>!x.startsWith('https://')))throw new Error('Production requires HTTPS origins');
