import { User } from './user.entity';
export declare class Document {
    id: number;
    uuid: string;
    documentName: string;
    documentSize: number;
    description: string;
    modifiedDate: Date;
    userId: number;
    user: User;
}
export declare class DocumentHistory {
    id: number;
    description: string;
    documentSize: number;
    createdDate: Date;
    documentId: number;
    document: Document;
    userId: number;
    user: User;
}
