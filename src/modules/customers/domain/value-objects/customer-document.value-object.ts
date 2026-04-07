import { DomainException } from '../../../../shared/domain/errors/domain.exception';
import { CustomerDocumentType } from '../enums/customer-document-type.enum';

export class CustomerDocument {
    private readonly _value: string;
    private readonly _type: CustomerDocumentType;

    constructor(value: string, type: CustomerDocumentType) {
        const normalizedValue = value.replace(/\D/g, '');

        if (type === CustomerDocumentType.CPF && !/^\d{11}$/.test(normalizedValue)) {
            throw new DomainException('Invalid CPF.');
        }

        if (type === CustomerDocumentType.CNPJ && !/^\d{14}$/.test(normalizedValue)) {
            throw new DomainException('Invalid CNPJ.');
        }

        this._value = normalizedValue;
        this._type = type;
    }

    get value(): string {
        return this._value;
    }

    get type(): CustomerDocumentType {
        return this._type;
    }
}