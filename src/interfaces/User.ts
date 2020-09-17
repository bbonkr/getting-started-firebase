export interface User {
    uid: string;
    displayName: string;
    updateProfile: (profile: Partial<User>) => Promise<void>;
}
