import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google";
 
export default {
      trustHost: true,
      providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                access_type: "offline",
                response_type: "code",
                scope: "openid profile email https://www.googleapis.com/auth/calendar.events"
              }
            }
        }),
        Google({
            id: "google-calendar",
            name: "Google Calendar",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
                scope: "openid profile https://www.googleapis.com/auth/calendar.events"
              }
            },
            profile(profile) {
              return {
                id: profile.sub,
                name: profile.name,
                image: profile.picture,
              }
            }
        })
     ] 
    } satisfies NextAuthConfig