export declare enum Role {
    ADMIN = "ADMIN",
    ENCODER = "ENCODER",
    REVIEWER = "REVIEWER"
}
export declare class User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    createdDate: Date;
}
