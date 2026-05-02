import { Customer } from '../entities/customer.entity';

export abstract class CustomerRepository {
    abstract create(customer: Customer): Promise<void>;
    abstract findById(id: string): Promise<Customer | null>;
    abstract findByDocument(document: string): Promise<Customer | null>;
    abstract findAll(): Promise<Customer[]>;
    abstract update(customer: Customer): Promise<void>;
}