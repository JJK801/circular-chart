import Item from './Item';

import { number, object, string } from 'joi';

const schema = object<ProductCreateParams, ProductData>({
    name: string(),
    data: object().pattern(
        string(), number()
    )
})

export interface ProductData {
    [key: string]: number;
}

export interface ProductCreateParams {
    name: string;
    data: ProductData;
}

export class Product {
    private _items: Item[];

    get items(): Item[] {
        return [...this._items];
    }

    get value () {
        return this._items.reduce((sum, { amount }) => sum + amount, 0)
    }

    static create(params: any) {
        const { value: validatedParams } = schema.validate(params, { convert: true });

        return new Product(validatedParams);
    }

    constructor ({ data }: ProductCreateParams) {
        this._items = Object.entries(data).map(([name, amount]) => 
            Item.create(this, { name, amount })
        )
    }
}

export default Product