export class PatientRes {
    public mrn: number;
    public covidScore: number;

    constructor(mrn: number, covidScore: number) {
        this.mrn = mrn;
        this.covidScore = covidScore;
    }
}