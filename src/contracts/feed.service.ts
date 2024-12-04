export interface FeedService {
  post(message: string, imageUrl?: string): Promise<void>;
}
