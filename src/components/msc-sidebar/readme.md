ce# msc-sidebar



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                                                                                       | Type                | Default                    |
| ---------- | ----------- | ----------------------------------------------------------------------------------------------------------------- | ------------------- | -------------------------- |
| `autoShow` | `auto-show` | Should the Sidebar expand when you're near it?                                                                    | `boolean`           | `false`                    |
| `fixed`    | `fixed`     | If true, styling applies position: fixed instead of position: absolute                                            | `boolean`           | `undefined`                |
| `keepOpen` | `open`      | Should the Sidebar always be open?                                                                                | `boolean`           | `false`                    |
| `overlay`  | `overlay`   | Wether or not the sidebar should take up space in the document. If true, full content is exposed on hovering/tap. | `boolean`           | `true`                     |
| `side`     | `side`      | If true, styling applies position: fixed instead of position: absolute                                            | `"left" \| "right"` | `SidebarPositions.Default` |
| `single`   | `single`    | Controls wether or not only one item can be expanded.                                                             | `boolean`           | `true`                     |


## Methods

### `hide() => Promise<void>`

Hides the Sidebar.

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Shows the Sidebar.

#### Returns

Type: `Promise<void>`



### `toggle(newState?: boolean) => Promise<void>`

Inverts current state or forces a specific state

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
