export type Badge = {
  tier: string | null;
  balance: string;
};

export type DevMetrics = {
  commentCount: number;
  uniqueCommenters: number;
  badgesFound: number;
  cacheHits: number;
  cacheMisses: number;
  dbQueries: number;
  elapsedMs: number;
};

export type CommentUser = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
};

export type Comment = {
  id: string;
  body: string;
  createdAt: string;
  user: CommentUser;
};

export type CommentsApiResponse = {
  comments: Comment[];
  badges: Record<string, Badge>;
  _devMetrics?: DevMetrics;
};
