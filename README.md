# msc-public

This is a collection of personal components which may, or may not be used in real-world products.

If you want, you can try it. There is no official support, this is just a public version of it.

It's tailored to my use-cases and is NOT generalized, like bootstrap. It's purpesfully flexible, hencewhy there are some quirks to make it play well (pretty much) everywhere.

Some of them are roughly outlined below.

# Base design

The basic design - without any configuration, is insipired by both:
- [Carbon Design](https://www.carbondesignsystem.com/)
- [Material Design](https://material.io/)

trying to achieve an best-of-both-worlds without any overloading just to make it fancy, or to restrict configuratabillity.

## A note on Singletons

Singletons don't exist in normal JS, or are realized as module exports.

The traditional Singleton pattern shall ensure a simplistic, known way of
recieving and handling those instances. Also, it will ensure lesser
affine developers to always work with _exactly_ the same instances each time
and not accidentially creating a different one by an wrong export/import.

**They are NOT intended to be used extensively in a parent project as this will create a deep connection with this library and your application.**

You have been warned.

## Global side-effects

See [global script](src/global.ts).

- Globally [exposed singletons](src/global/expose-global.ts)
- [`activate` CustomEvent](#activate)
- accessible onClick handlers
- global progress indicator (currently only used for ApiService)

## Custom Events

### Activate

**VanillaJS**: `activate`  
**JSX**: `onActivate`

**Purpose**: Standardizing the two special event types apart from `onClick` needed for correctly reflecting accesibillity cases and responsive device interaction.

**Editors Note**: non-vanilla js types need to be supplied by yourself. This package only provides the correct global type for Stencil. See [types.d.ts](src/types.d.ts:28:7).

**Related documents**:
- [SCR20](https://www.w3.org/TR/WCAG20-TECHS/SCR20.html)
- [SCR35](https://www.w3.org/TR/WCAG20-TECHS/SCR35.html)
- [G90](https://www.w3.org/TR/WCAG20-TECHS/G90.html)

## Enforced technique for legible readabillity

**Purpose**: Basic ensurance that specific components that are intended to be colorable/overwritable to have the correct "light" or "dark" text-color applied.

**Functions**:
- `ensureColorContrastFor` - Core utillity to implement in components to enforce the color contrast. Operates in a "forceful" and "flexible" mode.
- `getBackgroundBrightnessFor` - Core function to decide the lightness of an provided element's background. **Only works with background-color, NOT images**
- `lightTheme` - Util function to apply logic only when the result is light, but intended is a dark theme.
- `darkTheme` - Util function to apply logic only when the result is dark, but intended is a light theme.

**Editors Note**:
**Flexible** means you can overwrite both variants using the CSS-vars `--text-on-dark` and `--text-on-light`. Otherwise will fallback to Theme settings of the Application. In order to debug and ensure the acccsibillity of components, in dev mode, you'll be able to see the exact criterias that are met in order to apply the correct variant.

The contrast decision is leveraging `requestAnimationFrame` in order to apply the decision as-soon-as-possible, but might have to fractionally delay the decision when:
1. The component (or related components) are not fully initialized and therefor cannot check the styles
2. The document is still loading assets, like stylesheets and cannot assure the current applied styles are the intended one

**Related documents**:
- [Contrast Minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [G18 luminance formula](https://www.w3.org/TR/WCAG20-TECHS/G18.html#G18-tests)

## Translations

**The internal TranslationService is NOT exposed globally**

- Translations are not bound to any patterns like i18n.
- Translations can be structured like namespaces
- Translations wqill never throw Errors, instead, a "missing translation" string is returned () 