import { Component } from '@angular/core';
import { ToastService } from '../../../service/toast-service';
import { AsyncPipe } from '@angular/common';
import { Toast } from "../toast/toast";

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.html',
  imports: [AsyncPipe, Toast], 
  styleUrls: ['./toast-container.scss']
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) { }
}
