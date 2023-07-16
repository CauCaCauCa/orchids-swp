export class TableColumn {
    constructor(id, label, minWidth, component, handleClick) {
        this.id = id || "";
        this.label = label || "";
        this.minWidth = minWidth || 50;
        this.component = component || (() => { });
        this.handleClick = handleClick || undefined;
    }
}

export class SelectItem {
    constructor(value, label) {
        this.value = value || '';
        this.label = label || '';
    }
}