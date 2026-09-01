export interface AiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface AiChatRequest {
  message: string;
  conversationId?: string;
}

export interface AiChatResponse {
  conversationId: string;
  reply: string;
  suggestedProductIds?: string[];
}

export interface AiRecommendationRequest {
  productId?: string;
  roomType?: string;
  stylePreference?: string;
}

export interface AiRecommendationResponse {
  productIds: string[];
  rationale: string;
}
