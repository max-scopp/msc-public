import { JSX, FunctionalComponent } from '@stencil/core';
import { Constructable } from './general';

export interface RenderableComponent {
  render(): JSX.Element | JSX.Element[];
}

export type Renderable = Array<
  FunctionalComponent |
  Constructable<RenderableComponent>
>;

export type AnyComponent =
  Renderable
  | FunctionalComponent
  | Constructable<RenderableComponent>;

/**
 * An action is a configuratable object that has no dependency to the visual representation
 * of it.
 * It obliges to no callback related to the actions. But, if an callback
 * has been provided, that callback will receive the the activated "Action"'s `name`.
 * The "display" is used differently dependant on the context, but is always used
 * to "display" the Action for the user.
 */
export interface Action {
  /**
   * The value you get when activated.
   */
  name: string;

  /**
   * The thing to "display". If a single char, this will be rendered.
   * Otherwise, the complete length of the string will be used as <msc-icon name="{display}">
   * (usually)
   */
  display: string;
}

/**
 * !IMPORTANT! Don't forget to add the designated @Prop decorator(s)!
 */
export interface LinkableComponent {
  /**
   * An attribute/prop that is usually exposed as "to" which intern will
   * open the provided link when activated.
   * Or whatever the criteria is.
   * !IMPORTANT! To make your life easier, be sure to set the prop to "reflect" the current value!
   */
  href: string;

  /**
   * if an href (usually called "to" as attribute/prop) is provided,
   * should there be a specific target type applied?
   */
  target: '_blank' | '_self' | '_parent' | '_top' | string;
}
