import { CustomerDocument } from '../value-objects/customer-document.value-object';

export type CustomerProps = {
    id: string;
    name: string;
    document: CustomerDocument;
    phone?: string | null;
    email?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export class Customer {
    public readonly id: string;
    public name: string;
    public document: CustomerDocument;
    public phone?: string | null;
    public email?: string | null;
    public readonly createdAt: Date;
    public updatedAt: Date;

    constructor(props: CustomerProps) {
        this.id = props.id;
        this.name = props.name;
        this.document = props.document;
        this.phone = props.phone ?? null;
        this.email = props.email ?? null;
        this.createdAt = props.createdAt ?? new Date();
        this.updatedAt = props.updatedAt ?? new Date();
    }
}