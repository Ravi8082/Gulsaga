// Password-reset route; the one-time token is validated and consumed by the API.
import { createFileRoute } from '@tanstack/react-router';
import { ResetPassword } from '@/components/gulsags/forms';
import { pageHead } from '@/lib/gulsags/content';
export const Route=createFileRoute('/reset-password')({head:()=>({meta:[...pageHead('Reset Administrator Password','Secure Gulsaga account recovery.').meta,{name:'robots',content:'noindex'}]}),component:ResetPassword});
