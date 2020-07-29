# msc-menu



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type                    | Default     |
| ------------ | ------------- | ----------- | ----------------------- | ----------- |
| `open`       | `open`        |             | `boolean`               | `true`      |
| `positionTo` | `position-to` |             | `HTMLElement \| string` | `undefined` |


## Events

| Event   | Description | Type               |
| ------- | ----------- | ------------------ |
| `close` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [msc-button-group](../msc-button-group)

### Depends on

- [msc-list](../msc-list)

### Graph
```mermaid
graph TD;
  msc-menu --> msc-list
  msc-button-group --> msc-menu
  style msc-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
