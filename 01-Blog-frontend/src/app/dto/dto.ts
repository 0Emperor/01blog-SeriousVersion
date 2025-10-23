
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
export interface NotificationDto {
    sender: User | null; 
    id:number,
    link: string | null;
    seen: boolean;
    type: 'FOLLOW' | 'POST' | 'LINK' | 'REMOVED' | 'HIDDEN';
    createdAt: string; // ISO timestamp
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
    hidden:boolean;
}
export interface Comment{
    id: string;
    post:Post;
    user: User;
    createdAt: Date;
    content:string
    isOwn:boolean;
}
export enum reason {
    SPAM,
    HATE_SPEECH,
    INAPPROPRIATE_CONTENT,
    BULLYING_HARASSMENT,
    INTELLECTUAL_PROPERTY
}
export interface ProfileDto {
    user: User;                 
    people: User[];            
    followersCount: number;     
    followingCount: number;     
    isFollowing: boolean;       
    isMe: boolean;             
  }