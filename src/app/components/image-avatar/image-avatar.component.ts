import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-avatar',
  templateUrl: './image-avatar.component.html',
  styleUrls: ['./image-avatar.component.css']
})
export class ImageAvatarComponent {

  defaultImagePath = "./assets/images/defaultUser.jpg";

  @Input() imagePath = null;
  @Input() size: number = 0;
}
