export class StringHelper {
    static isNullOrEmpty(s: string): boolean {
        if (!s) {
            return true;
        } else {
            if (s.trim() === "") {
                return true;
            }
            return false;
        }
    }
}