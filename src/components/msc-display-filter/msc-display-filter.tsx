import { Component, h, Listen, Prop } from '@stencil/core';
import { fuzzyMatch } from 'core/utils/search';


@Component({
    tag: 'msc-display-filter',
    styleUrl: 'msc-display-filter.scss'
})
export class MscDisplayFilter {
    @Prop()
    for: string | HTMLElement

    @Listen('change')
    @Listen('userInput')
    reduceTargetByTypedQuery(ev) {
        const { target } = ev;
        const { value } = target;

        if (value) {
            this.filterForChildren(value);
        } else {
            this.resetForChildren();
        }
    }

    filterForChildren(value) {
        this.forChildren
            .forEach((child: HTMLElement) => {
                const doesMatch = this.computeMatch(child, value);
                child.style.setProperty('display', doesMatch ? '' : 'none');
            })
    }

    resetForChildren() {
        this.forChildren
            .forEach((child: HTMLElement) => {
                child.style.setProperty('display', '');
            })
    }

    computeMatch(element: HTMLElement, search: string) {
        return fuzzyMatch(search, element.textContent);
    }

    get forChildren() {
        return Array.from(this.forElement.children);
    }

    get forElement() {
        if (typeof this.for === 'string') {
            return document.getElementById(this.for);
        }

        return this.for;
    }

    render() {
        return (
            <slot></slot>
        );
    }
}
