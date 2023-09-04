import { DatePipe } from "@angular/common";
import { environment } from "../../environments/environment";

export class SearchDate {
    static searchFullDate(txtSearch) {
        let regDate = /^(0?[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012]|[1-9])[- /.](19|20)\d\d$/;
        if (this.isValidTxtSearch(regDate, txtSearch) == true) {
            let st = txtSearch;
            let pattern = /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/;
            let dt = new Date(st.replace(pattern, "$3-$2-$1"));
            //
            let datePipe = new DatePipe("en-US");
            let myOutDate: string = "";
            myOutDate = datePipe.transform(dt, environment.formatDateTable);
            return myOutDate;
        } else {
            return null;
        }

    }

    static searchDayMonth(txtSearch) {
        let regDayMonth = /^(0?[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012]|[1-9])$/;
        if (this.isValidTxtSearch(regDayMonth, txtSearch) == true) {
            let st = txtSearch;
            let parts = st.split(/[\/\-\.]/);
            let myOutDate: string = "";
            parts.forEach((x, i) => {
                if (x.toString().length === 1) {
                    let y  = `0${x}`;
                    parts[i] = y;
                }
            });
            myOutDate = `${parts[1]}-${parts[0]}`;
            return myOutDate;
        } else {
            return null;
        }
    }

    static isValidTxtSearch(regexp, txtSearch) {
        return regexp.test(txtSearch);
    }

    static formatToISODate(date: any) {
        let datePipe = new DatePipe("en-US");
        let myOutDate: string = "";
        myOutDate = datePipe.transform(date, environment.formatDateTimeTable);
        return myOutDate;
    }

    static formatDate(value: Date) {
        if (value) {
            let date = new Date(value);
            return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
        }
        return value;
    }
}