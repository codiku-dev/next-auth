import { UnsensitiveUser } from "@/utils/user"
import { User } from "@prisma/client"
import NextAuth, { Account } from "next-auth"
import { AdapterAccount } from "next-auth/adapters"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: JWT & Account & UnsensitiveUser
    }
}