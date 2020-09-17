export interface Post {
    id: string;
    text: string;
    attachments?: string[];
    createdAt: number;
    createdBy: string;
}
