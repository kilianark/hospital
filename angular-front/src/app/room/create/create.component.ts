import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateRoomComponent {

}
