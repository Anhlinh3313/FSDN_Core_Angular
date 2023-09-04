export class FilterUtil {
    static gbFilterFiled(row, gbFilter, columns) {
        let isInFilter = false;
        let noFilter = true;

        if (gbFilter) {
            gbFilter = gbFilter.toString().toLowerCase();
            for (var index = 0; index < columns.length; index++) {
                let columnName = columns[index];
                let rowValue: String;
                let arr = columnName.split(".");

                if (arr.length == 1) {
                    if (row[columnName] == null) {
                        continue;
                    }

                    noFilter = false;
                    rowValue = row[columnName].toString().toLowerCase();
                } else if (arr.length > 1) {
                    if (!row[arr[0]])
                        continue;

                    let element = row[arr[0]][arr[1]];
                    if (element == null) {
                        continue;
                    }

                    noFilter = false;
                    rowValue = element.toString().toLowerCase();
                }

                if (rowValue.includes(gbFilter)) {
                    isInFilter = true;
                }
            }
        }

        if (noFilter) { isInFilter = true; }

        return isInFilter;
    }

    static filterField(row, filter) {
        let isInFilter = false;
        let noFilter = true;

        for (var columnName in filter) {
            if (row[columnName] == null) {
                return;
            }
            noFilter = false;
            let rowValue: String = row[columnName].toString().toLowerCase();
            let filterMatchMode: String = filter[columnName].matchMode;
            if (filterMatchMode.includes("contains") && rowValue.includes(filter[columnName].value.toLowerCase())) {
                isInFilter = true;
            } else if (filterMatchMode.includes("startsWith") && rowValue.startsWith(filter[columnName].value.toLowerCase())) {
                isInFilter = true;
            } else if (filterMatchMode.includes("in") && filter[columnName].value.includes(rowValue)) {
                isInFilter = true;
            }
        }

        if (noFilter) { isInFilter = true; }

        return isInFilter;
    }

    static compareField(rowA, rowB, field): number {
        if (!field) {
            return 1;
        }
        const arrField = field.split(".");
        const collator = new Intl.Collator("en", {numeric: true, sensitivity: "base"});
        if (arrField.length === 1) {
            if (rowA[field] == null) return 1; // on considère les éléments null les plus petits
            if (typeof rowA[field] === "string") {
                return collator.compare(rowA[field], rowB[field]);
            }
            if (typeof rowA[field] === "number") {
                if (rowA[field] > rowB[field]) return 1;
                else return -1;
            }
        }
        if (arrField.length === 2) {
            if (!rowA[arrField[0]] || !rowB[arrField[0]]) return 1; // on considère les éléments null les plus petits
            if (rowA[arrField[0]][arrField[1]] != null) {
                if (typeof rowA[arrField[0]][arrField[1]] === "string") {
                    return collator.compare(rowA[arrField[0]][arrField[1]], rowB[arrField[0]][arrField[1]]);
                }
                if (typeof rowA[arrField[0]][arrField[1]] === "number") {
                    if (rowA[arrField[0]][arrField[1]] > rowB[arrField[0]][arrField[1]]) return 1;
                    else return -1;
                }
            }
        }
    }
}