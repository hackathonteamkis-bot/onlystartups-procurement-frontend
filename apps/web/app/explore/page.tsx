export const dynamic = "force-dynamic";

import { getExploreData } from "@/actions/explore";
import { PageHeader } from "@/components/shared/page-header";
import { ExploreClient } from "@/components/explore/explore-client";

export default async function ExplorePage() {
  const res = await getExploreData();

  if (res && "error" in res) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Explore"
          description="Discover the engines of innovation."
        />
        <div className="py-20 text-center">
          <p className="text-destructive font-medium">{res.error as string}</p>
        </div>
      </div>
    );
  }

  const data = res || {
    govDepartments: [],
    resources: [],
    events: [],
    fundingOpportunities: [],
    programs: [],
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Explore"
        description="Discover the engines of innovation."
      />

      <ExploreClient initialData={data} />
    </div>
  );
}
