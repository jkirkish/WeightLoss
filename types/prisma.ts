import { Prisma } from "@prisma/client"

// Define types based on Prisma's generated types
export type FeatureWithVotes = Prisma.FeatureGetPayload<{
  include: {
    votes: true;
    _count: {
      select: { votes: true };
    };
  };
}>;

export type FeatureWithDetails = Prisma.FeatureGetPayload<{
  include: {
    creator: true;
    votes: true;
    _count: {
      select: { votes: true };
    };
  };
}>; 