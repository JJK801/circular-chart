import Product from './Product';
import Utils from './Utils';

export interface ItemCreateParams {
    name: string;
    amount: number;
}

export interface Item extends ItemCreateParams {
    product: Product;
}

export class Item {
    readonly color: string = Utils.randomColor();

    get percentage () {
        return Utils.percentage(this.amount, this.product.value);
    }

    constructor(product: Product, { name, amount }: ItemCreateParams) {
        this.product = product;
        this.name = name;
        this.amount = amount;
    }

    static create(product: Product, params: ItemCreateParams) {
        return new Item(product, params)
    }
}

export default Item;