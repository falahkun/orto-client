import { z } from 'zod';

export const PlayerSchema = z.object({
  id: z.string(),
  communityMemberId: z.string().optional(),
  name: z.string().min(1, 'Nama pemain tidak boleh kosong'),
  matchesPlayed: z.number().default(0),
  totalPoints: z.number().default(0),
});

export type Player = z.infer<typeof PlayerSchema>;

export const MatchSchema = z.object({
  id: z.string(),
  index: z.number(),
  teamA: z.array(PlayerSchema).length(2),
  teamB: z.array(PlayerSchema).length(2),
  scoreA: z.number().nullable().default(null),
  scoreB: z.number().nullable().default(null),
  status: z.enum(['pending', 'active', 'completed']).default('pending'),
});

export type Match = z.infer<typeof MatchSchema>;

export const SessionSchema = z.object({
  isActive: z.boolean().default(false),
  durationMinutes: z.number().min(1).default(10),
  targetMatchesPerPlayer: z.number().min(1).default(4),
});

export type Session = z.infer<typeof SessionSchema>;
