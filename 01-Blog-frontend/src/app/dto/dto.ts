
/**
 * Interface for the nested user summary data returned by the backend.
 * Corresponds to your Java PostResponse.UserSummary.
 */
export interface User {
    id: string;
    username: string;
    role: 'beta' | 'ADMIN';
    bio: string;
    profile: string;
}

/**
 * Interface for a single post object.
 * Corresponds to your Java PostResponse.
 */
export interface Post {
    postId:string;
    title: string;
    description: string;
    mediaUrl: string[];
    createdAt: Date;
    user: User;
    totalLikes: number | 0;
    totalComments: number | 0;
    isLiked:boolean;
    isOwn:boolean;
}
export interface Comment{
    id: string;
    post:Post;
    user: User;
    createdAt: Date;
    content:string
}