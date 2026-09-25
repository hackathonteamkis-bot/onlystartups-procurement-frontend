//server component
import { cache } from "react";
import { auth } from "@/auth";

/**
 * Request-scoped cached auth helper.
 * React's `cache()` ensures that within a single server request,
 * multiple calls to `getSession()` only execute `auth()` once.
 * This prevents redundant JWT decoding + DB queries when both
 * the root layout and child layouts/pages need the session.
 */
export const getSession = cache(async () => {
    return await auth();
});

export const currentUser = async () => {
    const session = await getSession();
    return session?.user;
};