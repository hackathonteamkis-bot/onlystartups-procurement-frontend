export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { trackAnalytics } from "@/actions/dashboard/analytics";
import { auth } from "@/auth";

interface JoinPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function JoinPage({ params }: JoinPageProps) {
    const { id } = await params;
    const session = await auth();

    // Track the hit only if it's NOT a self-visit
    // If user is not logged in, we count it (likely a new founder)
    // If logged in, we check if they are the govDepartment
    const isSelfVisit = session?.user?.id === id;

    if (!isSelfVisit) {
        await trackAnalytics("LINK_TAP", "govDepartment_form", id, { source: "direct_link" });
    }

    // Redirect to the govDepartment application/profile page
    redirect(`/explore/gov-departments/${id}`);
}
