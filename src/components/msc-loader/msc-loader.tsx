import { Component, h, Host } from '@stencil/core';


@Component({
  tag: 'msc-loader',
  styleUrl: 'msc-loader.scss',
  shadow: true
})
export class MscLoader {
  render() {
    return (
      <Host role="presentation">
        <span>
          <slot />
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="204" height="204" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" display="block">
          <rect x="49.5" y="31" rx="0" ry="0" width="1" height="10" fill="rgba(0, 0, 0, 0.8)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8849557522123893s" begin="-0.8112094395280235s" repeatCount="indefinite" /></rect>
          <rect x="49.5" y="31" rx="0" ry="0" width="1" height="10" fill="rgba(0, 0, 0, 0.8)" transform="rotate(30 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8849557522123893s" begin="-0.7374631268436577s" repeatCount="indefinite" /></rect>
          <rect x="49.5" y="31" rx="0" ry="0" width="1" height="10" fill="rgba(0, 0, 0, 0.8)" transform="rotate(60 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8849557522123893s" begin="-0.663716814159292s" repeatCount="indefinite" /></rect>
          <rect x="49.5" y="31" rx="0" ry="0" width="1" height="10" fill="rgba(0, 0, 0, 0.8)" transform="rotate(90 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8849557522123893s" begin="-0.5899705014749261s" repeatCount="indefinite" /></rect>
          <rect x="49.5" y="31" rx="0" ry="0" width="1" height="10" fill="rgba(0, 0, 0, 0.8)" transform="rotate(120 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8849557522123893s" begin="-0.5162241887905604s" repeatCount="indefinite" /></rect>
          <rect x="49.5" y="31" rx="0" ry="0" width="1" height="10" fill="rgba(0, 0, 0, 0.8)" transform="rotate(150 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8849557522123893s" begin="-0.4424778761061946s" repeatCount="indefinite" /></rect>
          <rect x="49.5" y="31" rx="0" ry="0" width="1" height="10" fill="rgba(0, 0, 0, 0.8)" transform="rotate(180 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8849557522123893s" begin="-0.36873156342182883s" repeatCount="indefinite" /></rect>
          <rect x="49.5" y="31" rx="0" ry="0" width="1" height="10" fill="rgba(0, 0, 0, 0.8)" transform="rotate(210 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8849557522123893s" begin="-0.29498525073746307s" repeatCount="indefinite" /></rect>
          <rect x="49.5" y="31" rx="0" ry="0" width="1" height="10" fill="rgba(0, 0, 0, 0.8)" transform="rotate(240 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8849557522123893s" begin="-0.2212389380530973s" repeatCount="indefinite" /></rect>
          <rect x="49.5" y="31" rx="0" ry="0" width="1" height="10" fill="rgba(0, 0, 0, 0.8)" transform="rotate(270 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8849557522123893s" begin="-0.14749262536873153s" repeatCount="indefinite" /></rect>
          <rect x="49.5" y="31" rx="0" ry="0" width="1" height="10" fill="rgba(0, 0, 0, 0.8)" transform="rotate(300 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8849557522123893s" begin="-0.07374631268436577s" repeatCount="indefinite" /></rect>
          <rect x="49.5" y="31" rx="0" ry="0" width="1" height="10" fill="rgba(0, 0, 0, 0.8)" transform="rotate(330 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="0.8849557522123893s" begin="0s" repeatCount="indefinite" /></rect>
        </svg>
      </Host>
    );
  }
}
