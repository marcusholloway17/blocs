import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { InputOptionsInterface } from '@azlabsjs/smart-form-core';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit {
  @Input() input!: InputOptionsInterface;
  @Input() control!: AbstractControl
  
  constructor() { }

  ngOnInit(): void {
  }

}
