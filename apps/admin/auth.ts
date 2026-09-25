import NextAuth from "next-auth";
import authConfig from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import { UserRole } from "@/schemas";

interface BackendUser {
  id: string;
  role: UserRole;
  access_token?: string;
  user?: any;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://onlystartups-api.vercel.app";

/**
 * How often (in milliseconds) the JWT callback should refetch
 * the full user profile from the backend. Between refetches,
 * the cached token data is returned as-is.
 *
 * Set to 5 minutes   a good balance between freshness and performance.
 * Client-side mutations should use update() for instant propagation.
 */
const PROFILE_REFETCH_INTERVAL_MS = 5 * 60 * 1000;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (token.accessToken && session) {
        (session as { user: any; accessToken: string }).accessToken =
          token.accessToken as string;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        (session.user as any).firstName = (token.firstName as string) ?? "";
        (session.user as any).lastName = (token.lastName as string) ?? "";
        session.user.email = token.email ?? "";
        session.user.bio = (token.bio as string) || null;
        session.user.twitter = (token.twitter as string) || null;
        session.user.linkedin = (token.linkedin as string) || null;
        session.user.instagram = (token.instagram as string) || null;
        session.user.startupName = (token.startupName as string) || null;
        session.user.startupDescription =
          (token.startupDescription as string) || null;
        session.user.startupPhase = (token.startupPhase as string) || null;
        session.user.bannerImage = (token.bannerImage as string) || null;
        session.user.image = (token.image as string) || null;
        session.user.onboardingComplete =
          (token.onboardingComplete as boolean) || false;
        session.user.title = (token.title as string) || null;
        session.user.yearsOfExperience =
          (token.yearsOfExperience as string) || null;
        session.user.skills = (token.skills as string[]) || [];
        session.user.referralSource = (token.referralSource as string) || null;
        session.user.thesis = (token.thesis as string) || null;
        session.user.thesisAnswers =
          (token.thesisAnswers as Record<string, string>) || null;
        // GovDepartment profile fields
        session.user.activeStartups = (token.activeStartups as string) || null;
        session.user.totalExits = (token.totalExits as string) || null;
        session.user.fundingRaised = (token.fundingRaised as string) || null;
        session.user.mentorCount = (token.mentorCount as string) || null;
        session.user.networkSize = (token.networkSize as string) || null;
        session.user.govDepartmentQuote =
          (token.govDepartmentQuote as string) || null;
        session.user.websiteUrl = (token.websiteUrl as string) || null;
        session.user.location = (token.location as string) || null;
        session.user.sectors = (token.sectors as string[]) || [];
        session.user.programDuration =
          (token.programDuration as string) || null;
        session.user.equityTaken = (token.equityTaken as string) || null;
        session.user.govDepartmentSocials =
          (token.govDepartmentSocials as Record<string, string>) || null;
        session.user.applicationQuestions =
          (token.applicationQuestions as any) || null;
        session.user.applicationFormActive =
          typeof token.applicationFormActive === "boolean"
            ? token.applicationFormActive
            : true;
      }
      return session;
    },

    async jwt({ token, user, trigger, session }) {
      // 1. Initial sign-in   merge backend login response into token
      if (user) {
        const u = user as unknown as BackendUser;
        if (!u.access_token) {
          // Social Login (Google, etc.) - Exchange profile with backend
          try {
            const nameParts = ((user as any).name || "").split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || undefined;

            const response = await fetch(`${API_URL}/auth/social-login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-auth-secret": process.env.AUTH_SECRET || "",
              },
              body: JSON.stringify({
                email: user.email,
                firstName,
                ...(lastName ? { lastName } : {}),
                image: user.image,
              }),
            });
            if (response.ok) {
              const backendData = await response.json();
              if (backendData?.user?.role !== "ADMIN") {
                throw new Error("AccessDenied");
              }
              token.accessToken = backendData.access_token;
              token.sub = backendData.user.id;
              token.role = backendData.user.role;
              Object.assign(token, backendData.user);
            } else {
              console.error(
                "[AUTH_JWT_CALLBACK] Backend social-login failed with status:",
                response.status,
              );
            }
          } catch (error) {
            console.error(
              "[AUTH_JWT_CALLBACK] Backend social-login request failed:",
              error,
            );
          }
        } else {
          // Standard Credentials login
          token.accessToken = u.access_token;
          token.sub = u.user?.id || u.id;
          token.role = u.user?.role || u.role;
          if (u.user) {
            const { password, ...safeUserData } = u.user;
            Object.assign(token, safeUserData);
          }
        }
        token.lastRefreshed = Date.now();
        return token;
      }

      // 2. Client-side update() call   merge immediately for instant UI update.
      //    This is the key mechanism that eliminates the need for hard refreshes:
      //    after settings.ts saves data, the component calls update({ user: freshData })
      //    which triggers this branch and immediately updates the JWT.
      if (trigger === "update" && session?.user) {
        return { ...token, ...session.user, lastRefreshed: Date.now() };
      }

      // 3. Time-gated background refetch from backend.
      //    Only re-fetch the full profile if enough time has elapsed.
      //    This prevents hammering the backend on every single server request
      //    while still keeping data reasonably fresh.
      if (!token.accessToken) {
        if (token.email) {
          try {
            const nameParts = (token.name || "").split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || undefined;

            const response = await fetch(`${API_URL}/auth/social-login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-auth-secret": process.env.AUTH_SECRET || "",
              },
              body: JSON.stringify({
                email: token.email,
                firstName,
                ...(lastName ? { lastName } : {}),
                image: token.picture || null,
              }),
            });
            if (response.ok) {
              const backendData = await response.json();
              if (backendData?.user?.role !== "ADMIN") {
                return { ...token, accessToken: undefined };
              }
              token.accessToken = backendData.access_token;
              token.sub = backendData.user.id;
              token.role = backendData.user.role;
              Object.assign(token, backendData.user);
              token.lastRefreshed = Date.now();
            } else {
              console.error(
                "[AUTH_JWT_CALLBACK] Background social-login failed with status:",
                response.status,
              );
            }
          } catch (error) {
            console.error(
              "[AUTH_JWT_CALLBACK] Background social-login request failed:",
              error,
            );
          }
        }
        return token;
      }

      const lastRefreshed = (token.lastRefreshed as number) || 0;
      const elapsed = Date.now() - lastRefreshed;

      if (elapsed < PROFILE_REFETCH_INTERVAL_MS) {
        // Token data is fresh enough   skip the backend call
        return token;
      }

      // Enough time has passed   refetch profile from backend
      try {
        const response = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
          cache: "no-store",
        });
        if (response.ok) {
          const freshUser = await response.json();
          return { ...token, ...freshUser, lastRefreshed: Date.now() };
        } else if (response.status === 401) {
          token.accessToken = undefined;
          return token;
        }
      } catch (error) {
        console.error("Error refreshing token data:", error);
      }

      // If refetch failed, update timestamp anyway to avoid retry-storming
      return { ...token, lastRefreshed: Date.now() };
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    ...(authConfig.providers || []),
    Credentials({
      async authorize(credentials) {
        if (credentials?.backendResponse) {
          let data;
          try {
            data = JSON.parse(credentials.backendResponse as string);
          } catch {
            return null;
          }
          if (data?.user?.role !== "ADMIN") {
            return null;
          }
          return data;
        }

        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validatedFields.data),
          });

          if (response.ok) {
            const data = await response.json();
            if (data?.user?.role !== "ADMIN") {
              return null;
            }
            return data;
          }
        }

        return null;
      },
    }),
  ],
});
