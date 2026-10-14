// Shared Prisma client used by API handlers and background processing.
import { PrismaClient } from '@prisma/client';
export const db=new PrismaClient();
