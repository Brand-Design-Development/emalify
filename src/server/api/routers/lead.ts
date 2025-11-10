import { z } from "zod";
import type { Prisma } from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "@emalify/server/api/trpc";
import { LeadLabelZod, LeadProgressZod } from "@emalify/lib/types";

export const leadRouter = createTRPCRouter({
  // Get all leads with optional filters
  getAll: protectedProcedure
    .input(
      z.object({
        label: z.string().optional(),
        progress: z.string().optional(),
        search: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Prisma.LeadWhereInput = {};

      if (input.label !== undefined) {
        if (input.label !== "") {
          where.label = input.label;
        }
      }

      if (input.progress) {
        where.progress = input.progress;
      }

      if (input.search) {
        where.OR = [
          { fullName: { contains: input.search, mode: "insensitive" } },
          { email: { contains: input.search, mode: "insensitive" } },
          { company: { contains: input.search, mode: "insensitive" } },
        ];
      }

      if (input.startDate ?? input.endDate) {
        where.submissionDate = {};
        if (input.startDate) {
          where.submissionDate.gte = new Date(input.startDate);
        }
        if (input.endDate) {
          where.submissionDate.lte = new Date(input.endDate);
        }
      }

      const leads = await ctx.db.lead.findMany({
        where,
        orderBy: { submissionDate: "desc" },
      });

      return leads;
    }),

  // Get a single lead by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.lead.findUnique({
        where: { id: input.id },
      });
    }),

  // Update a lead
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        fullName: z.string().optional(),
        email: z.string().email().optional(),
        phoneNumber: z.string().optional(),
        company: z.string().optional(),
        currentPosition: z.string().optional(),
        label: LeadLabelZod.optional(),
        progress: LeadProgressZod.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.lead.update({
        where: { id },
        data,
      });
    }),

  // Delete a lead
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.lead.delete({
        where: { id: input.id },
      });
    }),

  // Get statistics for dashboard
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [totalLeads, labelStats, progressStats, recentLeads] =
      await Promise.all([
        ctx.db.lead.count(),
        ctx.db.lead.groupBy({
          by: ["label"],
          _count: true,
        }),
        ctx.db.lead.groupBy({
          by: ["progress"],
          _count: true,
        }),
        ctx.db.lead.findMany({
          take: 10,
          orderBy: { submissionDate: "desc" },
        }),
      ]);

    // Get leads per day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const leadsOverTime = await ctx.db.lead.findMany({
      where: {
        submissionDate: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: { submissionDate: "asc" },
    });

    return {
      totalLeads,
      labelStats: labelStats.map((stat) => ({
        label: stat.label,
        count: stat._count,
      })),
      progressStats: progressStats.map((stat) => ({
        progress: stat.progress,
        count: stat._count,
      })),
      recentLeads,
      leadsOverTime,
    };
  }),
});
