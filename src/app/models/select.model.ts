import { SelectItem } from "primeng/primeng";

export class SelectModel implements SelectItem {
    label?: string;
    value: any;
    styleClass?: string;
    icon?: string;
    title?: string;
    data?: any;
}