"use client";

import { useState } from "react";
import { Badge } from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import { Search, Download, Filter, MoreHorizontal, Database } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@onlystartups/ui";

// Generate 42 mock items to demonstrate 15-per-page pagination
const SECTORS = ["DeepTech", "SaaS", "HealthTech", "FinTech", "Sustainability", "EdTech", "AI/ML"];
const SOURCES = ["Program Q3", "Pitch Event", "Direct Application", "Referral", "Event - Green Summit"];
const STATUSES = ["Accepted", "Under Review", "Rejected", "Waitlisted"];

const MOCK_DATABASE = Array.from({ length: 42 }).map((_, i) => ({
  id: `${i + 1}`,
  startupName: `Startup ${String.fromCharCode(65 + (i % 26))}${i}`,
  founderName: `Founder ${i + 1}`,
  email: `contact${i + 1}@startup${i}.com`,
  phone: `+91 ${9000000000 + i}`,
  sector: SECTORS[i % SECTORS.length],
  source: SOURCES[i % SOURCES.length],
  status: STATUSES[i % STATUSES.length],
  date: `2023-10-${String((i % 30) + 1).padStart(2, '0')}`,
}));

export default function DatabasePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filter logic based on search and tab
  const filteredData = MOCK_DATABASE.filter(item => {
    const matchesSearch = item.startupName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.founderName.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    
    if (activeTab === "program apps") return item.source.includes("Program");
    if (activeTab === "event apps") return item.source.includes("Event");
    if (activeTab === "accepted") return item.status === "Accepted";
    
    return true; // "all records"
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Accepted":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Accepted</Badge>;
      case "Under Review":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Under Review</Badge>;
      case "Rejected":
        return <Badge className="bg-rose-50 text-rose-700 border-rose-200">Rejected</Badge>;
      case "Waitlisted":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Waitlisted</Badge>;
      default:
        return <Badge className="bg-slate-50 text-slate-700 border-slate-200">{status}</Badge>;
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-500" />
            <h1 className="text-2xl font-bold text-gray-900">Unified Database</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Manage all program, event, and direct applications in one central CRM.
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button variant="outline" className="text-sm h-9 bg-white border-slate-200 shadow-sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" className="text-sm h-9 bg-white border-slate-200 shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden min-h-[600px]">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            {["All Records", "Program Apps", "Event Apps", "Accepted"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab.toLowerCase());
                  setCurrentPage(1); // Reset to page 1 on tab change
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search startups, founders..."
              className="w-full pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
            />
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto w-full flex-1">
          <table className="w-full text-sm text-left whitespace-nowrap min-w-[800px]">
            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 font-semibold">Startup</th>
                <th className="px-5 py-3 font-semibold">Founder</th>
                <th className="px-5 py-3 font-semibold">Contact Info</th>
                <th className="px-5 py-3 font-semibold">Sector</th>
                <th className="px-5 py-3 font-semibold">Source</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900">{row.startupName}</p>
                      <p className="text-[10px] text-slate-500">Applied {row.date}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 font-medium">{row.founderName}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-slate-900">{row.email}</p>
                      <p className="text-[10px] text-slate-500">{row.phone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">{row.sector}</td>
                    <td className="px-5 py-3.5 text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">{row.source}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {getStatusBadge(row.status)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="text-slate-400 hover:text-slate-900 p-1 rounded-md hover:bg-slate-200 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Shadcn Pagination Footer */}
        {totalPages > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 bg-slate-50/50 gap-4">
            <span className="shrink-0">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} records
            </span>
            
            <Pagination className="justify-end m-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(p => p - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  // Simple logic to show current, first, last, and ellipsis
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          href="#" 
                          isActive={currentPage === page}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(p => p + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
