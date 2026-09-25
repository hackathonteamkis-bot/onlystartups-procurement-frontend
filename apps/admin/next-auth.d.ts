import { UserRole } from "@/schemas";
import { DefaultSession } from "next-auth";

export type ExtendedUser = {
  id: string;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  onboardingComplete: boolean;
  firstName: string | null;
  lastName: string | null;
  email: string;
  image: string | null;
  bio: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  startupName: string | null;
  startupDescription: string | null;
  startupPhase: string | null;
  bannerImage: string | null;
  title: string | null;
  yearsOfExperience: string | null;
  skills: string[];
  referralSource: string | null;
  thesis: string | null;
  thesisAnswers: Record<string, string> | null;
  activeStartups: string | null;
  totalExits: string | null;
  fundingRaised: string | null;
  mentorCount: string | null;
  networkSize: string | null;
  startupHubQuote: string | null;
  websiteUrl: string | null;
  location: string | null;
  sectors: string[];
  programDuration: string | null;
  equityTaken: string | null;
  startupHubSocials: Record<string, string> | null;
  applicationQuestions: any;
  applicationFormActive: boolean;
} & DefaultSession["user"];

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    accessToken?: string;
    isTwoFactorEnabled?: boolean;
    onboardingComplete?: boolean;
    bio?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
    instagram?: string | null;
    startupName?: string | null;
    startupDescription?: string | null;
    startupPhase?: string | null;
    bannerImage?: string | null;
    title?: string | null;
    yearsOfExperience?: string | null;
    skills?: string[];
    referralSource?: string | null;
    thesis?: string | null;
    thesisAnswers?: Record<string, string> | null;
    activeStartups?: string | null;
    totalExits?: string | null;
    fundingRaised?: string | null;
    mentorCount?: string | null;
    networkSize?: string | null;
    startupHubQuote?: string | null;
    websiteUrl?: string | null;
    location?: string | null;
    sectors?: string[];
    programDuration?: string | null;
    equityTaken?: string | null;
    startupHubSocials?: Record<string, string> | null;
    applicationQuestions?: any;
    applicationFormActive?: boolean;
  }
}

