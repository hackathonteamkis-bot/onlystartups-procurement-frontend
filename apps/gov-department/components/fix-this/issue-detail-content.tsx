"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  MinusCircle,
  MessageSquare,
  AlertTriangle,
  Zap,
  HelpCircle,
  ListChecks,
  ShieldCheck,
  Loader2,
  Clock,
} from "lucide-react";
import { Button } from "@onlystartups/ui";
import { Textarea } from "@onlystartups/ui";
import { Badge } from "@onlystartups/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@onlystartups/ui";
import { toggleUpvoteAction, createCommentAction, toggleCommentUpvoteAction } from "@/actions/fix-this";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@onlystartups/ui";

interface Comment {
  id: string;
  parentId?: string | null;
  content: string;
  isAlternativeInfo: boolean;
  isOperationalImpact: boolean;
  isEdgeCase: boolean;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
    role: string;
  };
  upvotesCount: number;
  hasUpvoted: boolean;
}

interface Issue {
  id: string;
  title: string;
  coreFriction: string;
  targetDemographic: string;
  manualWorkarounds: string;
  tags: string[];
  createdAt: string;
  painIndex: number;
  upvotesCount: number;
  commentsCount: number;
  hasUpvoted: boolean;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
    startupName?: string | null;
  };
  comments: Comment[];
}

interface IssueDetailContentProps {
  initialIssue: Issue;
}

export function IssueDetailContent({ initialIssue }: IssueDetailContentProps) {
  const router = useRouter();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [issue, setIssue] = useState<Issue>(initialIssue);
  const [comments, setComments] = useState<Comment[]>(initialIssue.comments);
  const [commentContent, setCommentContent] = useState("");


  const [submittingComment, setSubmittingComment] = useState(false);
  const [openAuthAlert, setOpenAuthAlert] = useState(false);

  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const [recommendations, setRecommendations] = useState<Issue[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://onlystartups-api.vercel.app";
        const res = await fetch(`${API_URL}/fix-this`, {
          cache: "no-store",
        });
        if (res.ok) {
          const allIssues: Issue[] = await res.json();
          const filtered = allIssues.filter((i) => i.id !== initialIssue.id).slice(0, 4);
          setRecommendations(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch recommended problems:", err);
      }
    };
    fetchRecommendations();
  }, [initialIssue.id]);

  // Recalculate and fetch fresh issue info from backend
  const refreshIssue = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://onlystartups-api.vercel.app";
      const res = await fetch(`${API_URL}/fix-this/${initialIssue.id}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setIssue(data);
        setComments(data.comments);
      }
    } catch (err) {
      console.error("Failed to refresh bottleneck details:", err);
    }
  };

  const handleUpvote = async () => {
    if (!isLoggedIn) {
      setOpenAuthAlert(true);
      return;
    }

    try {
      // Optimistic update
      const diff = issue.hasUpvoted ? -1 : 1;
      setIssue((prev) => ({
        ...prev,
        hasUpvoted: !prev.hasUpvoted,
        upvotesCount: prev.upvotesCount + diff,
        painIndex: prev.painIndex + (diff * 15),
      }));

      const result = await toggleUpvoteAction(issue.id);

      if (result.upvoted) {
        toast.success("Problem verified!");
      } else {
        toast.info("Upvote removed.");
      }
      
      refreshIssue();
    } catch (err: any) {
      toast.error(err.message || "Failed to upvote");
      refreshIssue();
    }
  };

  const handleCommentUpvote = async (commentId: string) => {
    if (!isLoggedIn) {
      setOpenAuthAlert(true);
      return;
    }

    try {
      // Optimistic UI update
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            const hasUpvoted = !c.hasUpvoted;
            const diff = hasUpvoted ? 1 : -1;
            return {
              ...c,
              hasUpvoted,
              upvotesCount: c.upvotesCount + diff,
            };
          }
          return c;
        })
      );

      const result = await toggleCommentUpvoteAction(commentId);
      
      // Sync up with backend result
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              hasUpvoted: result.upvoted,
              upvotesCount: result.upvotesCount,
            };
          }
          return c;
        })
      );
      
      refreshIssue();
    } catch (err: any) {
      toast.error(err.message || "Failed to vote on comment");
      refreshIssue();
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setOpenAuthAlert(true);
      return;
    }

    if (!commentContent.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    setSubmittingComment(true);
    try {
      await createCommentAction(issue.id, {
        content: commentContent,
        isAlternativeInfo: false,
        isOperationalImpact: false,
        isEdgeCase: false,
      });

      toast.success("Comment added successfully!");
      setCommentContent("");
      
      refreshIssue();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!replyContent.trim()) {
      toast.error("Reply content cannot be empty.");
      return;
    }

    setSubmittingReply(true);
    try {
      const newReply = await createCommentAction(issue.id, {
        content: replyContent,
        isAlternativeInfo: false,
        isOperationalImpact: false,
        isEdgeCase: false,
        parentId,
      });

      setComments((prev) => [newReply as any, ...prev]);
      setReplyContent("");
      setReplyingToCommentId(null);
      toast.success("Reply added successfully!");
      
      refreshIssue();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  // Helper to color Pain Index badge
  const getPainColor = (index: number) => {
    if (index >= 30) return "bg-[#F26522]/20 text-[#F26522] border-[#F26522]/30";
    if (index >= 15) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    return "bg-slate-500/10 text-slate-600 border-slate-500/20";
  };
  const topLevelComments = comments.filter((c) => !c.parentId);

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 px-0 sm:px-4">
      {/* Back button */}
      <div>
        <Link
          href="/fix-this"
          className="inline-flex items-center text-sm font-semibold text-[#1A1A2E]/60 hover:text-[#F26522] transition-colors gap-1.5 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Problems Feed
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Post Content & Comments */}
        <div className="lg:col-span-8 space-y-6">

      {/* Main Post Section */}
      <div className="space-y-4">
        {/* Creator details header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1A1A2E]/5 flex items-center justify-center border border-[#1A1A2E]/10">
            {issue.user.image ? (
              <Image src={issue.user.image} alt={`${(issue.user as any).firstName || ''} ${(issue.user as any).lastName || ''}`.trim() || "User"} fill unoptimized className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-[#1A1A2E]/60">
                {(`${(issue.user as any).firstName || ''} ${(issue.user as any).lastName || ''}`.trim() || "A").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-[#1A1A2E]">{`${(issue.user as any).firstName || ''} ${(issue.user as any).lastName || ''}`.trim() || "Anonymous User"}</span>
              {issue.user.startupName && (
                <>
                  <span className="text-[#1A1A2E]/30">•</span>
                  <span className="text-[#1A1A2E]/50 italic">Founder of {issue.user.startupName}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#1A1A2E]/40 font-medium mt-0.5">
              <span className="uppercase tracking-wider font-extrabold text-[#1A1A2E]/60 bg-zinc-100 px-1 py-0.5 rounded-md">
                {issue.user.role}
              </span>
              <span>•</span>
              <span>{new Date(issue.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-sans text-[#1A1A2E] leading-tight tracking-tight mt-3">
          {issue.title}
        </h1>

        {/* Tags */}
        {issue.tags && issue.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {issue.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[10px] font-bold text-[#F26522] bg-[#F26522]/5 border-[#F26522]/10 rounded-md px-2 py-0.5"
              >
                Category: {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Body Content */}
        <div className="space-y-4 sm:space-y-6 pt-4 text-[#1A1A2E]/85 text-sm sm:text-base leading-relaxed font-sans">
          <div className="space-y-1">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#F26522]">
              What is the problem?
            </div>
            <p className="font-medium text-[#1A1A2E]">{issue.coreFriction}</p>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#1A1A2E]/50">
              Who faces this?
            </div>
            <p className="font-medium text-[#1A1A2E]">{issue.targetDemographic}</p>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-extrabold uppercase tracking-wider text-amber-700/80">
              What is the current workaround?
            </div>
            <p className="font-medium italic text-[#1A1A2E]/75">{issue.manualWorkarounds}</p>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-4 border-t border-[#1A1A2E]/5">
          {/* Vote / Upvote Pill */}
          <div className="flex items-center bg-[#1A1A2E]/5 hover:bg-[#1A1A2E]/8 transition-colors rounded-full p-1 border border-[#1A1A2E]/5">
            <button
              onClick={handleUpvote}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                issue.hasUpvoted ? "text-[#F26522]" : "text-[#1A1A2E]/50 hover:text-[#F26522]"
              }`}
              title={issue.hasUpvoted ? "Remove Upvote" : "Upvote"}
            >
              <ArrowUp className={`w-3.5 h-3.5 ${issue.hasUpvoted ? "fill-current" : ""}`} />
            </button>
            <span className={`px-2 font-bold text-xs font-mono select-none ${issue.hasUpvoted ? "text-[#F26522]" : "text-[#1A1A2E]/80"}`}>
              {issue.upvotesCount}
            </span>
            <button
              onClick={handleUpvote}
              className="p-1.5 rounded-full text-[#1A1A2E]/30 hover:text-[#F26522] transition-colors cursor-pointer"
              title="Downvote"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Comments Count Pill */}
          <div className="flex items-center gap-1.5 bg-[#1A1A2E]/5 rounded-full px-3.5 py-1.5 text-[#1A1A2E]/70 font-bold text-xs border border-[#1A1A2E]/5 select-none">
            <MessageSquare className="w-3.5 h-3.5 text-[#1A1A2E]/50" />
            <span>{comments.length}</span>
          </div>

          {/* Pain Index Score Pill */}
          <div className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-bold text-xs border select-none ${getPainColor(issue.painIndex)}`} title="Validation Pain Index">
            <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span>{issue.painIndex.toFixed(1)} Pain</span>
          </div>

          {/* Share Pill */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied to clipboard!");
            }}
            className="flex items-center gap-1.5 bg-[#1A1A2E]/5 hover:bg-[#1A1A2E]/10 transition-colors rounded-full px-3.5 py-1.5 text-[#1A1A2E]/70 font-bold text-xs border border-[#1A1A2E]/5 cursor-pointer"
          >
            <span className="text-[#1A1A2E]/50 text-[11px]">🔗</span>
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-2 pt-6 border-t border-[#1A1A2E]/5">
        <h3 className="text-base font-bold font-sans text-[#1A1A2E] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#F26522]" />
          Comments ({comments.length})
        </h3>

        {/* Comment Submission Form */}
        <Card className="p-0 gap-0 bg-transparent border-none shadow-none rounded-2xl">
          <form onSubmit={handleCommentSubmit} className="pt-1 pb-2 space-y-3">
            <Textarea
              placeholder={
                isLoggedIn
                  ? "Write a comment..."
                  : "Login to verify this problem or post comments..."
              }
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              disabled={!isLoggedIn || submittingComment}
              rows={3}
              className="bg-transparent border-[#1A1A2E]/10 focus:border-[#F26522] rounded-xl text-sm"
            />

            {isLoggedIn && (
              <div className="flex justify-end w-full">
                <Button
                  type="submit"
                  disabled={submittingComment || !commentContent.trim()}
                  className="bg-[#1A1A2E] hover:bg-[#2A2A3E] text-white rounded-full text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-1.5 w-full sm:w-auto justify-center"
                >
                  {submittingComment && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Submit Comment
                </Button>
              </div>
            )}

            {!isLoggedIn && (
              <Button
                type="button"
                onClick={() => setOpenAuthAlert(true)}
                className="bg-[#1A1A2E] hover:bg-[#2A2A3E] text-white rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2"
              >
                Login to Comment
              </Button>
            )}
          </form>
        </Card>

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-6 pt-2">
            {topLevelComments.map((comment) => {
              const commentReplies = comments.filter((c) => c.parentId === comment.id);
              const isReplying = replyingToCommentId === comment.id;

              return (
                <div key={comment.id} className="space-y-4">
                  {/* Parent Comment */}
                  <div className="flex gap-3 relative group/comment">
                    {/* Left Column: Avatar */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-[#1A1A2E]/5 flex items-center justify-center border border-[#1A1A2E]/10">
                        {comment.user.image ? (
                          <Image src={comment.user.image} alt={`${(comment.user as any).firstName || ''} ${(comment.user as any).lastName || ''}`.trim() || "User"} fill unoptimized className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-bold text-[#1A1A2E]/60">
                            {(`${(comment.user as any).firstName || ''} ${(comment.user as any).lastName || ''}`.trim() || "A").charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="flex-1 min-w-0 pb-1">
                      {/* Header */}
                      <div className="flex items-center gap-1.5 flex-wrap text-xs">
                        <span className="font-bold text-[#1A1A2E] hover:underline cursor-pointer">{`${(comment.user as any).firstName || ''} ${(comment.user as any).lastName || ''}`.trim() || "Anonymous"}</span>
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#1A1A2E]/40 bg-zinc-100 px-1 py-0.5 rounded-md">
                          {comment.user.role}
                        </span>
                        <span className="text-[#1A1A2E]/30">•</span>
                        <span className="text-[#1A1A2E]/40 font-medium">
                          {new Date(comment.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="mt-1 text-sm text-[#1A1A2E]/80 font-medium leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </div>

                      {/* Footer Actions (Upvotes + Reply trigger) */}
                      <div className="flex items-center gap-2 text-xs text-[#1A1A2E]/40 mt-1.5">
                        <button
                          onClick={() => handleCommentUpvote(comment.id)}
                          className={`flex items-center gap-1.5 bg-[#1A1A2E]/5 px-2.5 py-0.5 rounded-md transition-colors cursor-pointer border border-[#1A1A2E]/5 hover:border-[#F26522]/30 ${
                            comment.hasUpvoted ? "text-[#F26522] bg-[#F26522]/5 border-[#F26522]/30" : "hover:text-[#F26522]"
                          }`}
                          title={comment.hasUpvoted ? "Remove Upvote" : "Upvote comment"}
                        >
                          <ArrowUp className={`w-3 h-3 ${comment.hasUpvoted ? "fill-current" : ""}`} />
                          <span className={`font-bold text-[10px] font-mono ${comment.hasUpvoted ? "text-[#F26522]" : "text-[#1A1A2E]/60"}`}>
                            {comment.upvotesCount}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            setReplyingToCommentId(isReplying ? null : comment.id);
                            setReplyContent("");
                          }}
                          className="text-[11px] font-bold text-[#1A1A2E]/50 hover:text-[#F26522] transition-colors px-2 py-0.5 rounded-md hover:bg-[#1A1A2E]/3 cursor-pointer"
                        >
                          Reply
                        </button>
                      </div>

                      {/* Inline Reply Input */}
                      {isReplying && (
                        <div className="mt-3 space-y-2 w-full sm:max-w-lg">
                          <Textarea
                            placeholder="Write your reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={2}
                            className="bg-transparent border-[#1A1A2E]/10 focus:border-[#F26522] rounded-xl text-xs resize-none"
                            autoFocus
                          />
                          <div className="flex justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setReplyingToCommentId(null)}
                              className="border-[#1A1A2E]/10 text-[#1A1A2E]/60 rounded-lg text-[10px] font-bold uppercase tracking-wider h-7 px-2.5"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              disabled={submittingReply || !replyContent.trim()}
                              onClick={() => handleReplySubmit(comment.id)}
                              className="bg-[#1A1A2E] hover:bg-[#2A2A3E] text-white rounded-lg text-[10px] font-bold uppercase tracking-wider h-7 px-3 flex items-center gap-1"
                            >
                              {submittingReply && <Loader2 className="w-3 h-3 animate-spin" />}
                              Post Reply
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comment Replies */}
                  {commentReplies.length > 0 && (
                    <div className="ml-4 sm:ml-10 pl-3 sm:pl-4 border-l border-[#1A1A2E]/10 space-y-4">
                      {commentReplies.map((reply) => (
                        <div key={reply.id} className="flex gap-2.5 relative">
                          {/* Left Column: Small Avatar */}
                          <div className="flex flex-col items-center shrink-0">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-[#1A1A2E]/5 flex items-center justify-center border border-[#1A1A2E]/10">
                              {reply.user.image ? (
                                <Image src={reply.user.image} alt={`${(reply.user as any).firstName || ''} ${(reply.user as any).lastName || ''}`.trim() || "User"} fill unoptimized className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[9px] font-bold text-[#1A1A2E]/60">
                                  {(`${(reply.user as any).firstName || ''} ${(reply.user as any).lastName || ''}`.trim() || "A").charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right Column: Reply Content */}
                          <div className="flex-1 min-w-0 pb-0.5">
                            {/* Header */}
                            <div className="flex items-center gap-1.5 flex-wrap text-xs">
                              <span className="font-bold text-[#1A1A2E] hover:underline cursor-pointer">{`${(reply.user as any).firstName || ''} ${(reply.user as any).lastName || ''}`.trim() || "Anonymous"}</span>
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#1A1A2E]/40 bg-zinc-100 px-1 py-0.5 rounded-md">
                                {reply.user.role}
                              </span>
                              <span className="text-[#1A1A2E]/30">•</span>
                              <span className="text-[#1A1A2E]/40 font-medium">
                                {new Date(reply.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                              </span>
                            </div>

                            {/* Content */}
                            <div className="mt-1 text-sm text-[#1A1A2E]/80 font-medium leading-relaxed whitespace-pre-wrap">
                              {reply.content}
                            </div>

                            {/* Footer Upvote */}
                            <div className="flex items-center gap-2 text-xs text-[#1A1A2E]/40 mt-1">
                              <button
                                onClick={() => handleCommentUpvote(reply.id)}
                                className={`flex items-center gap-1 bg-[#1A1A2E]/5 px-2 py-0.5 rounded-md transition-colors cursor-pointer border border-[#1A1A2E]/5 hover:border-[#F26522]/30 ${
                                  reply.hasUpvoted ? "text-[#F26522] bg-[#F26522]/5 border-[#F26522]/30" : "hover:text-[#F26522]"
                                }`}
                                title={reply.hasUpvoted ? "Remove Upvote" : "Upvote reply"}
                              >
                                <ArrowUp className={`w-3 h-3 ${reply.hasUpvoted ? "fill-current" : ""}`} />
                                <span className={`font-bold text-[9px] font-mono ${reply.hasUpvoted ? "text-[#F26522]" : "text-[#1A1A2E]/60"}`}>
                                  {reply.upvotesCount}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-transparent border border-[#1A1A2E]/5 rounded-2xl">
            <p className="text-[#1A1A2E]/50 text-sm">
              No comments have been logged for this problem yet.
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Right Column: Recommendations Sidebar */}
    <div className="lg:col-span-4 space-y-6 border-t lg:border-t-0 border-[#1A1A2E]/10 pt-6 lg:pt-0">
      <div className="space-y-4 lg:sticky lg:top-24">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#1A1A2E]/60 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#F26522] fill-current animate-pulse" />
          Recommended Problems
        </h3>
        
        {recommendations.length > 0 ? (
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <Link
                key={rec.id}
                href={`/fix-this/${rec.id}`}
                className="block p-3 sm:p-4 rounded-xl border border-[#1A1A2E]/5 bg-[#1A1A2E]/2 hover:bg-[#1A1A2E]/5 transition-all hover:border-[#F26522]/20 group"
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-sm text-[#1A1A2E] group-hover:text-[#F26522] transition-colors line-clamp-2 leading-snug">
                    {rec.title}
                  </h4>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPainColor(rec.painIndex)}`}>
                    {rec.painIndex.toFixed(0)} Pain
                  </span>
                </div>

                {rec.tags && rec.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {rec.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[9px] font-medium text-[#1A1A2E]/40">
                        Category: {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-[#1A1A2E]/40 mt-2.5 pt-2 border-t border-[#1A1A2E]/5">
                  <span className="font-medium">By {`${(rec.user as any).firstName || ''} ${(rec.user as any).lastName || ''}`.trim() || "Anonymous"}</span>
                  <span className="font-bold text-[#F26522]">{rec.upvotesCount} votes</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-[#1A1A2E]/10 rounded-xl">
            <span className="text-xs text-[#1A1A2E]/40 font-medium">No other problems found</span>
          </div>
        )}
      </div>
    </div>
  </div>

      {/* Authentication Dialog */}
      <Dialog open={openAuthAlert} onOpenChange={setOpenAuthAlert}>
        <DialogContent className="max-w-md bg-[#F5F5EE] border-[#1A1A2E]/10 p-6 rounded-2xl shadow-xl">
          <DialogHeader className="text-left space-y-2">
            <DialogTitle className="text-xl font-bold font-sans text-[#1A1A2E]">
              Authentication <span className="font-serif font-normal italic text-[#F26522]">Required</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-[#1A1A2E]/60">
              You must be logged in to OnlyStartups to upvote problems or post comments.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpenAuthAlert(false)}
              className="border-[#1A1A2E]/10 text-[#1A1A2E]/60 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Cancel
            </Button>
            <Button
              onClick={() => router.push(`/auth/login?callbackUrl=/fix-this/${issue.id}`)}
              className="bg-[#1A1A2E] hover:bg-[#2A2A3E] text-white rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2"
            >
              Login / Sign Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
