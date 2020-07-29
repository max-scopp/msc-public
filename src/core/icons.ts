import { lazy } from "./utils";

export interface IconSetConfig {
  name: string;
  baseClassName?: string;
  tagName?: string;
  isInlineSet?: true;
}

export interface SvgIcon {
  name: string;
  svg: SVGElement;
}

export type IconDefinition = string | SvgIcon;
export type IconSetDefinition = {
  icons: IconSet;
  configuration: IconSetConfig;
};

export class IconSet {
  [k: string]: string | SVGElement;

  constructor(namedIcons?: IconDefinition[], iconSetPrefix?: string) {
    if (namedIcons instanceof Array) {
      namedIcons.forEach((icon) => {
        if (typeof (icon) === 'string') {
          const key = icon.startsWith(iconSetPrefix)
            ? icon.substr(iconSetPrefix.length)
            : iconSetPrefix;
          this[key] = icon;
        } else {
          this[icon.name] = icon.svg;
        }
      });
    }
  }

  static fromSVGStringCollection(entries: { name: string; xmlString: string }[]) {
    const parser = new DOMParser();
    const newDef = entries.map((svg) => {
      const svgNode = parser.parseFromString(svg.xmlString, 'image/svg+xml').documentElement;
      lazy(() => {
        svgNode.removeAttribute('style');
        svgNode.querySelectorAll('[fill]').forEach((fillNode) => {
          fillNode.setAttribute('fill', 'currentcolor');
        });
      });
      return {
        name: svg.name,
        svg: svgNode as unknown as SVGElement,
      };
    });

    return new IconSet(newDef);
  }
}
