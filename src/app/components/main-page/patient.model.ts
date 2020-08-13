export class Patient {
    public mrn: number;
    public area: number;
    public age: number;

    constructor(mrn: number, area: number, age: number) {
        this.mrn = mrn;
        this.area = area;
        this.age = age;
    }
}