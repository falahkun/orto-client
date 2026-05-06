import { createClient } from '@/utils/supabase/client';

export type UserLimits = {
  maxCommunities: number;
  maxMembersPerCommunity: number;
  maxGuestsPerSession: number;
  maxMatchesPerSession: number;
};

export async function getUserLimits(): Promise<UserLimits | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      plan:plans (
        max_communities,
        max_members_per_community,
        max_guests_per_session,
        max_matches_per_session
      )
    `)
    .eq('user_id', user.id)
    .single();

  if (error || !data || !data.plan) {
    console.error('Error fetching limits:', error);
    return null;
  }

  const plan = data.plan as any;

  return {
    maxCommunities: plan.max_communities,
    maxMembersPerCommunity: plan.max_members_per_community,
    maxGuestsPerSession: plan.max_guests_per_session,
    maxMatchesPerSession: plan.max_matches_per_session,
  };
}

export async function checkCommunityLimit(): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const limits = await getUserLimits();
  if (!limits) return false;

  const { count, error } = await supabase
    .from('communities')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) return false;
  return (count ?? 0) < limits.maxCommunities;
}

export async function checkMemberLimit(communityId: string): Promise<boolean> {
  const supabase = createClient();
  const limits = await getUserLimits();
  if (!limits) return false;

  const { count, error } = await supabase
    .from('community_members')
    .select('*', { count: 'exact', head: true })
    .eq('community_id', communityId);

  if (error) return false;
  return (count ?? 0) < limits.maxMembersPerCommunity;
}

export async function checkGuestLimit(sessionId: string): Promise<boolean> {
  const supabase = createClient();
  const limits = await getUserLimits();
  if (!limits) return false;

  const { count, error } = await supabase
    .from('players')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId)
    .is('community_member_id', null);

  if (error) return false;
  return (count ?? 0) < limits.maxGuestsPerSession;
}

export async function checkMatchLimit(sessionId: string): Promise<boolean> {
  const supabase = createClient();
  const limits = await getUserLimits();
  if (!limits) return false;

  const { count, error } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId);

  if (error) return false;
  return (count ?? 0) < limits.maxMatchesPerSession;
}
