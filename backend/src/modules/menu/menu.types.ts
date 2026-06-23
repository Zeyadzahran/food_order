import { LocalizedString } from '../../types';

export interface CreateMenuItemBody {
    name: LocalizedString;
    description: LocalizedString;
    price: number;
    category: string;
    imageUrl: string;
    isAvailable?: boolean;
}

export type UpdateMenuItemBody = Partial<CreateMenuItemBody>;

export interface CreateCategoryBody {
    name: LocalizedString;
    description: LocalizedString;
}

export interface MenuQueryParams {
    category?: string;
    search?: string;
    available?: string; // 'true' or 'false'
    page?: string;
    limit?: string;
}
