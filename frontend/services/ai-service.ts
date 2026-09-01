import { apiClient, unwrap } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type {
  AiChatRequest,
  AiChatResponse,
  AiRecommendationRequest,
  AiRecommendationResponse,
} from "@/types/ai";

/**
 * Thin client for the AI-powered features. The heavy lifting (OpenAI calls,
 * prompt construction, moderation) lives entirely server-side in
 * Integrations/OpenAiService.cs — the frontend never talks to OpenAI directly.
 */
export const aiService = {
  chat: (payload: AiChatRequest) =>
    unwrap(apiClient.post<ApiResponse<AiChatResponse>>("/ai/chat", payload)),

  getRecommendations: (payload: AiRecommendationRequest) =>
    unwrap(apiClient.post<ApiResponse<AiRecommendationResponse>>("/ai/recommendations", payload)),

  describeProductFromImage: (imageUrl: string) =>
    unwrap(
      apiClient.post<ApiResponse<{ description: string; tags: string[] }>>("/ai/describe-image", {
        imageUrl,
      })
    ),
};
