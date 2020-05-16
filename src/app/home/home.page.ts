import { Component, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import { ImagePicker, OutputType } from '@ionic-native/image-picker/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  imageData: string;
  imageName: string;
  disableButtonSend: boolean;

  constructor(private file: File, public platform: Platform, private imagePicker: ImagePicker) {
    this.disableButtonSend = true;
  }
  
  ngOnInit() {
    
    this.imageData = './../../assets/icon/icon.png';
  }

  readImage(event: CustomEvent) {
    console.log(event);
    this.imageName = event.detail.value;
  }


  readFile() {
    this.platform.ready().then(
      ready => {
        if (this.platform.is('cordova')) {
          this.imagePicker.hasReadPermission().then(
            perm => {
              this.imagePicker.getPictures({
                maximumImagesCount: 10,
                width: 800,
                outputType: OutputType.DATA_URL
              }).then(images => {
                console.log(images);
                this.imageData = `data:image/png;base64, ${images[0]}`;
                this.disableButtonSend = false;
              });
            }
          );
        }
      });
  }

  sendFile() {


  }



}
