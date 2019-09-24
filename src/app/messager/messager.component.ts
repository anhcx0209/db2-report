import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-messager',
  templateUrl: './messager.component.html',
  styleUrls: ['./messager.component.css']
})
export class MessagerComponent implements OnInit {

  @Input() show = false;
  @Input() message: string;

  constructor() {
    this.message = 'There is no data available. <a href="#">How to loaded it?</a>';
  }

  ngOnInit() {    
  }

}
