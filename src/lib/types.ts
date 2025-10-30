import z from "zod";

export const LeadProgresses = [
  "Form Submitted",
  "Demo Call Booked",
  "Dead Lead",
  "Potential Lead",
  "Converted",
] as const;

export const LeadLabels = [
  "High Budget Lead",
  "Medium Budget Lead",
  "Low Budget Lead",
] as const;

export type LeadProgress = (typeof LeadProgresses)[number];
export type LeadLabel = (typeof LeadLabels)[number];

export type Lead = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  company: string;
  currentPosition: string;
  submissionDate: Date;
  label: LeadLabel;
  progress: LeadProgress;
  threadId: string;
  formMode: string;
  createdAt: Date;
  updatedAt: Date;
};

export const LeadLabelZod = z.enum(LeadLabels);
export const LeadProgressZod = z.enum(LeadProgresses);
