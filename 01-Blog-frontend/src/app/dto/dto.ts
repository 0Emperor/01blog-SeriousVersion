
export interface NotificationDto {
    sender: User | null;
    id: number,
    link: string | null;
    seen: boolean;
    type: 'FOLLOW' | 'POST' | 'LINK' | 'REMOVED' | 'HIDDEN';
    createdAt: string;
}

export interface Comment {
    id: string;
    post: Post;
    user: User;
    createdAt: Date;
    content: string
    isOwn: boolean;
}/**
 * Interface for a single post object.
 * Corresponds to your Java PostResponse.
 */
export interface Post {
    postId: string;
    title: string;
    description: string;
    mediaUrl: string[];
    createdAt: Date;
    user: User;
    totalLikes: number | 0;
    totalComments: number | 0;
    isLiked: boolean;
    isOwn: boolean;
    hidden: boolean;
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
/**
 * Interface for the nested user summary data returned by the backend.
 * Corresponds to your Java PostResponse.UserSummary.
 */
export interface User {
    id: string;
    username: string;
    name: string;
    role: 'beta' | 'ADMIN';
    bio: string;
    profile: string;
    isBaned: boolean;
}
export interface report {
    id: string,
    createdAt: Date,
    user: User,
    post: Post,
    reason: reason;
    state: state
}
export enum state {
    PENDING,
    ACTION_TAKEN,
    DISMISSED,
}

export interface DashboardData {
    recentReports: report[],
    recentUsers: User[],
    ReportsStats: { totalNumber: number, percentageChange: number },
    PostsStats: { totalNumber: number, percentageChange: number },
    UsersStats: { totalNumber: number, percentageChange: number }
}
