import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-skeleton-view',
  templateUrl: './skeleton-view.component.html',
  styleUrls: ['./skeleton-view.component.scss'],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SkeletonViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
