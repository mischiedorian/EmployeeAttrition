import {Component, Input, OnInit} from '@angular/core';
import * as CanvasJS from '../../assets/canvasjs.min';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FeatureImportance} from "../models/response/feature-importance";

@Component({
  selector: 'app-modal-feature-importance',
  templateUrl: './modal-feature-importance.component.html',
  styleUrls: ['./modal-feature-importance.component.css']
})
export class ModalFeatureImportanceComponent implements OnInit {

  @Input() public featureImportance: FeatureImportance;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    const chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2", // "light1", "light2", "dark1", "dark2"
      title: {
        text: "Employees Feature Importance"
      },
      axisY: {
        title: "Importance",
        suffix: "%",
        includeZero: false
      },
      axisX: {
        title: "Features"
      },
      data: [{
        type: "column",
        yValueFormatString: "#,##0.0#\"%\"",
        dataPoints: [
          { label: "Age", y: this.featureImportance.importance[0] },
          { label: "Education", y: this.featureImportance.importance[1] },
          { label: "Job level", y: this.featureImportance.importance[2] },
          { label: "Number companies worked", y: this.featureImportance.importance[3] },
          { label: "Training time last year", y: this.featureImportance.importance[4] },
          { label: "Years at company", y: this.featureImportance.importance[5] },
          { label: "Years since last promotion", y: this.featureImportance.importance[6] },
          { label: "Distance from home", y: this.featureImportance.importance[7] },
          { label: "Monthly income", y: this.featureImportance.importance[8] },
          { label: "Total working years", y: this.featureImportance.importance[9] }

        ]
      }]
    });
    chart.render();
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
