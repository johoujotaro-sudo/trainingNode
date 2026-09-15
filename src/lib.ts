export class Lib {
    isNullOrEmpty(text: string | number | null | undefined): boolean {
        if (text === null || text === undefined || text === '') {
            return true;
        }
        return false;
    }   
}