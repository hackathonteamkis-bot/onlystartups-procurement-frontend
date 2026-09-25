"use server";

import { fetchWithAuth } from "@/lib/api";

export async function createIssueAction(data: {
  title: string;
  coreFriction: string;
  targetDemographic: string;
  manualWorkarounds: string;
  tags: string[];
}) {
  return await fetchWithAuth("/fix-this", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function toggleUpvoteAction(issueId: string) {
  return await fetchWithAuth(`/fix-this/${issueId}/upvote`, {
    method: "POST",
  });
}

export async function createCommentAction(
  issueId: string,
  data: {
    content: string;
    isAlternativeInfo: boolean;
    isOperationalImpact: boolean;
    isEdgeCase: boolean;
    parentId?: string;
  }
) {
  return await fetchWithAuth(`/fix-this/${issueId}/comments`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function toggleCommentUpvoteAction(commentId: string) {
  return await fetchWithAuth(`/fix-this/comments/${commentId}/upvote`, {
    method: "POST",
  });
}
