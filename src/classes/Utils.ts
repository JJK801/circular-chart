export interface Coordinates {
    x: number;
    y: number;
}

export class Utils {
    static percentage(n: number, total: number) {
        return n * (100 / total);
    }

    static percentageToAngle(percentage: number) {
        return percentage * (360 / 100);
    }

    static polarToCartesian (radius: number, angle: number, offset: Coordinates = { x: 0, y: 0 }): Coordinates {
        const angleRad = ((angle % 360) * (Math.PI / 180));

        return {
            x: radius * Math.cos(angleRad) + offset.x,
            y: radius * -Math.sin(angleRad) + offset.y
        };
    }

    static randomColor () {
        return `#${Math.floor(Math.random()*16777215).toString(16)}`;
    }
}

export default Utils;   