import Item from "./Item";
import Product from "./Product";
import Utils, { Coordinates } from './Utils';

const SVG_WIDTH = 500;
const SVG_HEIGHT = 500;

const MAIN_CIRCLE_RADIUS = 100;
const MAIN_CIRCLE_STROKE = 10;

const DOT_CIRCLE_RADIUS = 120;
const DOT_RADIUS = 5;

interface ArcDefinition {
    item: Item,
    start: Coordinates,
    end: Coordinates
}

interface DotDefinition {
    item: Item,
    center: Coordinates
}

function computeArcs (items: Item[]): ArcDefinition[] {
    return items.reduce((computed: ArcDefinition[], item, i): ArcDefinition[] => {
        return [
            ...computed,
            {
                item,
                start: computed[computed.length-1]?.end || { x: SVG_WIDTH / 2 + MAIN_CIRCLE_RADIUS, y: SVG_HEIGHT / 2 },
                end: Utils.polarToCartesian(
                    MAIN_CIRCLE_RADIUS,
                    0-Utils.percentageToAngle(
                        items.slice(0, i+1).reduce((sum, { percentage }) => sum + percentage, 0)
                    ),
                    {
                        x: SVG_WIDTH / 2,
                        y: SVG_HEIGHT / 2
                    }
                )
            }
        ]
    }, []);
}


function computeDots (items: Item[]): DotDefinition[] {
    return items.reduce((computed: DotDefinition[], item, i): DotDefinition[] => {
        return [
            ...computed,
            {
                item,
                center: Utils.polarToCartesian(
                    DOT_CIRCLE_RADIUS,
                    0-Utils.percentageToAngle(
                        items.slice(0, i).reduce((sum, { percentage }) => sum + percentage, 0) + (item.percentage / 2)
                    ),
                    {
                        x: SVG_WIDTH / 2,
                        y: SVG_HEIGHT / 2
                    }
                )
            }
        ]
    }, []);
}

function formatPrice (price: number): string {
    return (Math.round(price * 100) / 100).toFixed(2);
}

export class Drawer {
    static draw (product: Product) {
        return `<?xml version="1.0"?>
            <svg width="${SVG_WIDTH}" height="${SVG_HEIGHT}" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" xmlns="http://www.w3.org/2000/svg" version="1.1">
                ${this.drawPrice(product)}
                ${this.drawMainCircle(product)}
                ${this.drawDotCircle(product)}
            </svg>
        `
    }

    static drawPrice(product: Product) {
        return `<text text-anchor="middle" x="${SVG_WIDTH / 2}" y="${SVG_HEIGHT / 2}">${formatPrice(product.value)} €</text>`
    }

    static drawMainCircle (product: Product) {
        return computeArcs(product.items).map(this.drawArc).join('');
    }

    static drawDotCircle (product: Product) {
        return computeDots(product.items).map(this.drawDot).join('');
    }

    static drawArc ({ item, start, end }: ArcDefinition) {
        let largeArcFlag = item.percentage > 50 ? 1 : 0;

        return `<path fill="none" stroke="${item.color}" stroke-width="${MAIN_CIRCLE_STROKE}" d="M ${start.x} ${start.y} A ${MAIN_CIRCLE_RADIUS} ${MAIN_CIRCLE_RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}" />`
    }

    static drawDot ({ item, center }: DotDefinition) {
        const textTransform: Coordinates = {
            x: center.x > (SVG_WIDTH / 2) ? 50 : -50,
            y: center.y > (SVG_HEIGHT / 2) ? 30 : -30
        }

        return `
            <circle cx="${center.x}" cy="${center.y}" r="${DOT_RADIUS}" fill="${item.color}" />
            <g>
                <text x="${center.x}" y="${center.y}" dominant-baseline="middle" text-anchor="middle" transform="translate(${textTransform.x} ${textTransform.y})">${item.name}</text>
                <text x="${center.x}" y="${center.y}" dominant-baseline="middle" text-anchor="middle" transform="translate(${textTransform.x} ${textTransform.y + 20})">${formatPrice(item.amount)} € (${Math.round(item.percentage * 100) / 100} %)</text>
            </g>
        `
    }
}

export default Drawer;