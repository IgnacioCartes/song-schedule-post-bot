export interface SocialFeedService {
  post(message: string, imageUrl?: string): Promise<void>;
}
