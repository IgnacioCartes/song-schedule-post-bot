export interface FeedService {
  post(message: string): Promise<void>;
}
