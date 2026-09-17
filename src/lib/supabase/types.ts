// Placeholder for Supabase generated types.
// Run: npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // TODO: player_profile, attributes, daily_logs, training_sessions,
      // financial_logs, quest_completions, boss_results, edge_events,
      // roa_entries, player_config, config_change_log, pivot_events
    };
  };
}
