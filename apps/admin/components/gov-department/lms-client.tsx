"use client";

import { useState, useCallback } from "react";
import {
  BookOpen,
  Video,
  FileText,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@onlystartups/ui";
import { Badge } from "@onlystartups/ui";
import { PageHeader } from "@/components/shared/page-header";
import { CreateResourceDialog } from "@/components/gov-department/create-resource-dialog";
import { getGovDepartmentData } from "@/actions/gov-department";

interface LMSResource {
  id: string;
  type: string;
  title: string;
  category?: string;
  tags?: string[];
  url: string;
}

export function LMSClient({ initialData }: { initialData: { resources?: LMSResource[] } }) {
  const [data, setData] = useState<{ resources?: LMSResource[] }>(initialData);

  const fetchData = useCallback(async () => {
    const res = await getGovDepartmentData();
    if (!("error" in res)) {
      setData(res);
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Knowledge Hub & SMS"
        description="Centralized resources and structured course delivery for founder programs."
      >
        <CreateResourceDialog onSuccess={fetchData} />
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.resources?.map((resource: LMSResource) => (
          <Card key={resource.id} className="group hover:border-[#F26522]/20 transition-all border-[#1A1A2E]/5 bg-white overflow-hidden rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-[#1A1A2E]/5 text-[#1A1A2E]/60 border-none font-bold text-[10px] uppercase tracking-widest">
                  {resource.type}
                </Badge>
                <div className="p-2 bg-[#F5F5EE] rounded-lg group-hover:bg-[#F26522]/5 transition-colors">
                  {resource.type === "Video" ? (
                    <Video className="w-4 h-4 text-orange-600" />
                  ) : (
                    <FileText className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              </div>
              <CardTitle className="text-lg font-bold group-hover:text-[#F26522] transition-colors line-clamp-1">
                {resource.title}
              </CardTitle>
              <CardDescription className="text-xs font-medium line-clamp-2 min-h-[32px]">
                Categorized under {resource.category || "General"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.tags?.map((tag: string) => (
                  <span key={tag} className="text-[10px] bg-[#F5F5EE] px-2 py-0.5 rounded text-[#1A1A2E]/40 font-bold">
                    #{tag}
                  </span>
                ))}
              </div>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#1A1A2E] text-white rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#F26522] transition-all"
              >
                Access Resource <ExternalLink className="w-3 h-3" />
              </a>
            </CardContent>
          </Card>
        ))}
        {(!data?.resources || data.resources.length === 0) && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center space-y-6">
            <div className="h-24 w-24 rounded-xl bg-[#F5F5EE] flex items-center justify-center shadow-inner">
              <BookOpen className="w-10 h-10 text-[#F26522] animate-pulse" />
            </div>
            <div className="space-y-2 max-w-sm">
              <h2 className="text-2xl font-black text-[#1A1A2E]">
                No Resources Yet
              </h2>
              <p className="text-sm text-[#1A1A2E]/60 font-medium">
                Upload your first workshop video, legal template, or strategy document to get started.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
