export type ProjectRole = 'ADMIN' | 'MEMBER';

export type Project = {
  createdAt: string;
  githubInstalled: boolean;
  id: string;
  /** The signed-in user's role here; null for a super admin who is not a member. */
  myRole?: ProjectRole | null;
  name: string;
  repoConnected: boolean;
  repoFullName?: string | null;
  targetUrl: string;
};

export type Connection<T> = {
  allData?: T[] | null;
  count?: number | null;
  nextPage?: number | null;
  prevPage?: number | null;
  totalPages?: number | null;
};
