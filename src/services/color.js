/**
 * https://medium.muz.li/the-science-of-color-contrast-an-expert-designers-guide-33e84c41d156
 * https://www.w3.org/TR/WCAG20-TECHS/G17.html
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */

export function hexToRgb(hex) {
    if (!/^#(([A-Fa-f0-9]{3}){1,2})$/.test(hex)) {
        return null;
    }

    const color = hex.substr(1);
    let rgb;

    if (color.length === 3) {
        rgb = color.match(/./g).map((x) => x + x);
    } else {
        rgb = color.match(/.{2}/g);
    }

    return rgb.map((x) => parseInt(x, 16));
}

export function luminance(color) {
    let rgb = hexToRgb(color);

    if (!rgb) {
        return null;
    }

    rgb = rgb.map((x) => x / 255).map((x) => {
        if (x <= 0.03928) {
            return x / 12.92;
        }

        return ((x + 0.055) / 1.055) ** 2.4;
    });

    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

export function contrast(color1, color2) {
    const l1 = luminance(color1);
    const l2 = luminance(color2);

    if (l1 === null || l2 === null) {
        return null;
    }

    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const cache = {};

export function colorType(color) {
    if (color in cache) {
        return cache[color];
    }

    const whiteContras = contrast(color, '#fff');
    const blackContras = contrast(color, '#000');
    let result;

    if (whiteContras === 1 && blackContras === 21) {
        result = 'white';
    } else if (whiteContras === 21 && blackContras === 1) {
        result = 'black';
    } else if (whiteContras >= 3 && blackContras < 10) {
        result = 'dark';
    } else {
        result = 'light';
    }

    cache[color] = result;

    return result;
}
