import { Component } from '@angular/core';
import { Patient } from './patient.model';
import { PatientRes } from './patient-res.model';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  // change when you add more people
  numPeople = 0;
  totalTestsUsed = 0;
  testsSaved = 0;
  peopleInBatch = 1;
  currCovidScoreTotal = 0;
  showText = false;
  showMedRec = false;
  currBatch = [];
  endOfList = false;
  index = 0;
  areaPercent = [0.16, 0.06, 0.13, 0.07, 0.07, 0.07, 0.07, 0.08, 0.07, 0.03, 0.07, 0.04, 0.05, 0.04, 0.1, 0.06 ]; // Area A - P
  agePercent = [0.10, 0.12, 0.10, 0.08, 0.08, 0.07, 0.05, 0.03, 0.03]; // Age 0-9, 10-19, etc .... 80 +

  // create array of patients to check
  people: Patient[] = [
    // med record number, area, age
    new Patient(111, 1, 15),
    new Patient(112, 5, 21),
    new Patient(113, 4, 70),
    new Patient(114, 2, 34),
    new Patient(115, 3, 92),
    new Patient(116, 3, 4),
    new Patient(117, 2, 23),
    new Patient(118, 5, 19),
    new Patient(119, 1, 80),
    new Patient(120, 3, 32),
    new Patient(121, 1, 55),
    new Patient(122, 3, 64),
  ];

  peopleScores: PatientRes[] = [
    // med record number, covid score of person
    new PatientRes(this.people[0].mrn, this.calcCovidScore(this.people[0])),
    new PatientRes(this.people[1].mrn, this.calcCovidScore(this.people[1])),
    new PatientRes(this.people[2].mrn, this.calcCovidScore(this.people[2])),
    new PatientRes(this.people[3].mrn, this.calcCovidScore(this.people[3])),
    new PatientRes(this.people[4].mrn, this.calcCovidScore(this.people[4])),
    new PatientRes(this.people[5].mrn, this.calcCovidScore(this.people[5])),
    new PatientRes(this.people[6].mrn, this.calcCovidScore(this.people[6])),
    new PatientRes(this.people[7].mrn, this.calcCovidScore(this.people[7])),
    new PatientRes(this.people[8].mrn, this.calcCovidScore(this.people[8])),
    new PatientRes(this.people[9].mrn, this.calcCovidScore(this.people[9])),
    new PatientRes(this.people[10].mrn, this.calcCovidScore(this.people[10])),
    new PatientRes(this.people[11].mrn, this.calcCovidScore(this.people[11])),
  ];

  // just show the people who should be batched together
  showBatchGroup(): void {
    this.index = 0;
    this.showMedRec = true;
    this.numPeople = this.peopleScores.length;
    // sort the array and initialize the covid score
    this.findBatchOrder();
    this.currCovidScoreTotal = this.peopleScores[0].covidScore;
    // tslint:disable-next-line: prefer-for-of
    for (this.index; this.index < this.peopleScores.length; this.index ++) {
      while (this.currCovidScoreTotal < 0.9 && this.peopleInBatch < 10) {
        this.currCovidScoreTotal += this.peopleScores[this.index].covidScore;  // error here
        this.peopleInBatch += 1;
        if (this.currBatch.length < 10) {
          this.currBatch.push(this.peopleScores[this.index].mrn);
        }
        this.endOfList = true;
        this.index++;
      }
      this.peopleInBatch = 0;
      this.currCovidScoreTotal = 0;
    }
  }

  // run full simulation
  runFullSimulation(): void {
    // first sort the list, then calc number of batches
    this.findBatchOrder();
    this.calcNumberBatches();

  }

  // sort the people who gave a sample by their covid scores to prep for batch test
  findBatchOrder(): void {
    this.peopleScores.sort((a, b) => a.covidScore < b.covidScore ? -1 : a.covidScore > b.covidScore ? 1 : 0);
  }

  /* iterate over each patient in the sorted array
  *  batch together as many as we can as long as
  *  prob is less than 90% pos for group
  *  increment the number of tests used when batch is done
  */
  calcNumberBatches(): void {
    this.index = 0;
    this.numPeople = this.peopleScores.length;
    this.totalTestsUsed = 0;
    // loop over the peopleScores array
    // tslint:disable-next-line: prefer-for-of
    for (this.index; this.index < this.peopleScores.length; this.index++) {
      // update curr covid score total
      this.currCovidScoreTotal = this.peopleScores[this.index].covidScore;
      // loop until 10 people in batch or prob > 0.9
      while (this.currCovidScoreTotal < 0.9 && this.index < 10) {
        this.currCovidScoreTotal += this.peopleScores[this.index].covidScore;
        this.index += 1;
      }
      this.totalTestsUsed += 1;
    }
    // update the tests saved
    this.testsSaved = this.numPeople - this.totalTestsUsed;
  }

  // call findArea and findAge functions in order to calc total score
  calcCovidScore(patient: Patient): number {
    return (this.findAreaScore(patient) + this.findAgeScore(patient)) / 2;
  }

  // find the corresponding covid likelihood based on where they live
  findAreaScore(patient: Patient): number {
    return this.areaPercent[patient.area];
  }

  // find the corresponding covid likelihood based on their age
  findAgeScore(patient: Patient): number {
    // handle 80+ case
    if (patient.age > 80) {
      return this.agePercent[8];
    }
    return this.agePercent[patient.age % 10];
  }

  toggleText(): void {
    this.showText = !this.showText;
  }

}
