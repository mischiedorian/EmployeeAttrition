import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import * as CanvasJS from '../../assets/canvasjs.min';
import {AttritionResponse} from "../models/response/attrition-response";

@Component({
  selector: 'app-modal-response',
  templateUrl: './modal-response.component.html',
  styleUrls: ['./modal-response.component.css']
})
export class ModalResponseComponent implements OnInit {

  @Input() public attritionResponse: AttritionResponse;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    const chart = new CanvasJS.Chart('chartContainer', {
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: 'Attrition Result'
      },
      legend: {
        cursor: 'pointer',
        itemclick: this.explodePie
      },
      data: [{
        type: 'pie',
        showInLegend: true,
        toolTipContent: '{name}: <strong>{y}%</strong>',
        indexLabel: '{name} - {y}%',
        dataPoints: [
          {y: this.attritionResponse.percentage, name: 'Happiness', exploded: true},
          {y: 100 - this.attritionResponse.percentage, name: 'Unhappiness'}
        ]
      }]
    });
    chart.render();
  }

  explodePie(e) {
    e.dataSeries.dataPoints[e.dataPointIndex].exploded =
      typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === 'undefined' ||
      !e.dataSeries.dataPoints[e.dataPointIndex].exploded;
    e.chart.render();
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}

