import { SupabaseClient } from "@repo/supabase";
import { Database } from "@repo/types";
import { ISuggestionRepository, CreateSuggestionInput, CreateSuggestionVoteInput, SuggestionWithVote } from "@repo/domain";

export class SuggestionsRepository implements ISuggestionRepository {
    constructor(private client: SupabaseClient) { }

    async create(data: CreateSuggestionInput): Promise<Database['public']['Tables']['suggestions']['Row']> {
        const { data: result, error } = await this.client
            .from('suggestions')
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result;
    }

    async findByBuildingId(buildingId: string, userId: string): Promise<SuggestionWithVote[]> {
        const { data, error } = await this.client
            .from('suggestions')
            .select('*, suggestion_votes(vote, voted_by)')
            .eq('building_id', buildingId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);

        return data.map((suggestion: any) => {
            const votes = suggestion.suggestion_votes || [];
            const upvotes = votes.filter((v: any) => v.vote === true).length;
            const downvotes = votes.filter((v: any) => v.vote === false).length;
            const userVoteRecord = votes.find((v: any) => v.voted_by === userId);
            const user_vote = userVoteRecord ? userVoteRecord.vote : undefined;

            const { suggestion_votes, ...rest } = suggestion;
            return {
                ...rest,
                upvotes,
                downvotes,
                user_vote
            };
        });
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.client
            .from('suggestions')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }

    async vote(data: CreateSuggestionVoteInput): Promise<void> {
        // Check if user is voting on their own suggestion
        const { data: suggestion, error: suggestionError } = await this.client
            .from('suggestions')
            .select('created_by')
            .eq('id', data.suggestion_id)
            .single();

        if (suggestionError) throw new Error(suggestionError.message);
        if (suggestion.created_by === data.voted_by) {
            throw new Error("You cannot vote on your own suggestion.");
        }

        const { data: existingVote, error: fetchError } = await this.client
            .from('suggestion_votes')
            .select('id, vote')
            .eq('suggestion_id', data.suggestion_id)
            .eq('voted_by', data.voted_by)
            .maybeSingle();

        if (fetchError) throw new Error(fetchError.message);

        if (existingVote) {
            if (existingVote.vote === data.vote) {
                // Remove vote if clicking the same option (toggle off)
                const { error } = await this.client
                    .from('suggestion_votes')
                    .delete()
                    .eq('id', existingVote.id);

                if (error) throw new Error(error.message);
            } else {
                // Update existing vote
                const { error } = await this.client
                    .from('suggestion_votes')
                    .update({ vote: data.vote })
                    .eq('id', existingVote.id);

                if (error) throw new Error(error.message);
            }
        } else {
            // Insert new vote
            const { error } = await this.client
                .from('suggestion_votes')
                .insert(data);

            if (error) throw new Error(error.message);
        }
    }
}
