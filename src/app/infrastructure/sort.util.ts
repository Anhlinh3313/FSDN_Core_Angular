export class SortUtil {
    static sortAlphanumerical(datasource: any, propParent: string, propChild?: string): any {
        const collator = new Intl.Collator("en", {numeric: true, sensitivity: "base"});
        if (propChild) {
            datasource = datasource.sort((a,b) => collator.compare(a[propParent][propChild], b[propParent][propChild]));
        } else {
            datasource = datasource.sort((a,b) => collator.compare(a[propParent], b[propParent]));
        }
        return datasource;
    }
}