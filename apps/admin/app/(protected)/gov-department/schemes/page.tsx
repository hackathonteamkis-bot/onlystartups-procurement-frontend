"use client";


import { useEffect, useState, useCallback } from "react";
import { Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@onlystartups/ui";
import { getGovDepartmentData } from "@/actions/gov-department";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@onlystartups/ui";
import { CreateSchemeDialog } from "@/components/gov-department/create-scheme-dialog";
import { ShareSchemeDialog } from "@/components/gov-department/share-scheme-dialog";
import { EditSchemeDialog } from "@/components/gov-department/edit-scheme-dialog";
import { useSession } from "next-auth/react";

interface FundingOpportunity {
  id: string;
  name: string;
  fundAmount: string | null;
  description: string | null;
  eligibility: string | null;
  benefits: string | null;
  reports?: any[];
}

export default function SchemesPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<{ fundingOpportunities?: FundingOpportunity[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const res = await getGovDepartmentData();
    if (!("error" in res)) {
      setData(res);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border rounded-xl p-6 space-y-6">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="h-16 w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Government Grant & Scheme Management"
          description="Compliance tracking and automated report generation for large-scale startup hub funding."
        />
        <div className="shrink-0">
          <CreateSchemeDialog onSuccess={fetchData} />
        </div>
      </div>

      <div className="grid gap-6">
        {data?.fundingOpportunities?.map((scheme: FundingOpportunity) => {
          const reports = scheme.reports || [];

          return (
            <Card
              key={scheme.id}
              className="group hover:border-[#F26522]/20 transition-all border-[#1A1A2E]/5 shadow-sm bg-white"
            >
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{scheme.name}</CardTitle>
                    <CardDescription>
                      Scheme Fund: {scheme.fundAmount || "N/A"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShareSchemeDialog
                      scheme={scheme}
                      govDepartmentId={session?.user?.id || ""}
                    />
                    <EditSchemeDialog scheme={scheme} onSuccess={fetchData} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5EE]/50">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-xs text-[#1A1A2E]/40 font-bold uppercase">
                          Program Performance
                        </p>
                        <p className="text-sm font-black">
                          {reports.length} Startups Active
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase text-[#1A1A2E]/40 mb-2">
                      Scheme Details
                    </p>
                    <p className="text-sm text-[#1A1A2E]/60">
                      {scheme.description ||
                        "No description provided for this scheme."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
