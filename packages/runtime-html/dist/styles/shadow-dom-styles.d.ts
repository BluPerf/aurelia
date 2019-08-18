import { HTMLDOM } from '../dom';
declare type HasAdoptedStyleSheets = ShadowRoot & {
    adoptedStyleSheets: CSSStyleSheet[];
};
export declare const noopShadowDOMStyles: Readonly<{
    applyTo: () => void;
}>;
export declare const IShadowDOMStyles: import("@aurelia/kernel").InterfaceSymbol<IShadowDOMStyles>;
export interface IShadowDOMStyles {
    applyTo(shadowRoot: ShadowRoot): void;
}
export declare class AdoptedStyleSheetsStyles implements IShadowDOMStyles {
    private sharedStyles;
    private readonly styleSheets;
    constructor(dom: HTMLDOM, localStyles: (string | CSSStyleSheet)[], styleSheetCache: Map<string, CSSStyleSheet>, sharedStyles?: IShadowDOMStyles | null);
    static supported(dom: HTMLDOM): boolean;
    applyTo(shadowRoot: HasAdoptedStyleSheets): void;
}
export declare class StyleElementStyles implements IShadowDOMStyles {
    private dom;
    private localStyles;
    private sharedStyles;
    constructor(dom: HTMLDOM, localStyles: string[], sharedStyles?: IShadowDOMStyles | null);
    applyTo(shadowRoot: ShadowRoot): void;
}
export {};
//# sourceMappingURL=shadow-dom-styles.d.ts.map