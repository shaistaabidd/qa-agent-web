export type Resource = {
  archived: boolean;
  category: string;
  createdAt: string;
  description?: string | null;
  id: string;
  isActive: boolean;
  pdfFileUrl?: string | null;
  resourceType: string;
  title: string;
  videoLink?: string | null;
};

export type ResourceFormValues = {
  category: string;
  description: string;
  file: File | null;
  resourceType: string;
  title: string;
  videoLink: string;
};
