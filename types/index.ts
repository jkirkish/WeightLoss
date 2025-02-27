import type { Feature, Vote, User } from "@prisma/client"

export type FeatureWithVotes = Feature & {
  votes: Vote[];
  _count: {
    votes: number;
  };
};

export type FeatureWithDetails = Feature & {
  creator: User;
  votes: Vote[];
  _count: {
    votes: number;
  };
}; 