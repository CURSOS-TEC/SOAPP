import { Component, OnInit } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { ImagePicker, OutputType } from '@ionic-native/image-picker/ngx';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
/**
 * Decorator of component
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
/**
 * Simple Page that sends an images to the server
 */
export class HomePage implements OnInit {
  imageData: string;
  imageName: string;
  disableButtonSend: boolean;
  filename: string;
  load: any;
  ip: string;
  port: string;

  /**
   * Constructor of component
   * @param transfer Plugin to send data
   * @param imagePicker Plugin to select picker
   * @param platform Access to the native platform
   * @param http Access to http request
   * @param alertController Controls the alert controller
   */
  constructor(
    private imagePicker: ImagePicker,
    public platform: Platform,
    private http: HttpClient,
    public loading: LoadingController,
    private alertController: AlertController) {
    this.disableButtonSend = true;
    this.ip = '52.226.138.182';
    this.port = '8080';
  }

  /**
   * Set an icon sample
   */
  ngOnInit() {
    this.imageData = './../../assets/icon/icon.png';
  }

  /**
   * Reads a file using date picker
   */
  readFile() {
    this.platform.ready().then(
      ready => {
        if (this.platform.is('cordova')) {
          this.imagePicker.hasReadPermission().then(
            perm => {
              this.imagePicker.getPictures({
                maximumImagesCount: 10,
                width: 500,
                height: 500,
                outputType: OutputType.DATA_URL
              }).then(images => {
                console.log(images);
                this.imageData = `data:image/png;base64, ${images[0]}`;
                // this.imageData = images[0];
                this.disableButtonSend = false;
              });
            }
          );
        }
      });
  }

  /**
   * Sends a file using HTTP request
   */
  sendFile() {
    const byteString = atob(this.imageData.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/jpg' });

    const dateName = Date.now().toLocaleString();
    const fileToSend: FormData = new FormData();
    this.presentAlert();
    fileToSend.append('file', blob, `${dateName}.jpg`);
    this.http.post(`http://${this.ip}:${this.port}`, fileToSend).subscribe(
      response => {
        console.log(response);
        this.load.dismiss();
      },
      error => {
        console.log(error);
        this.load.dismiss();
      });
  }


  /**
   * Enviado Imagen ventana de espera
   */
  async presentAlert() {
    this.load = await this.loading.create({
      message: 'Enviando imagen al servidor',
    });
    await this.load.present();
  }

  /**
   * Present loading configuration
   */
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Configuración del servidor',
      inputs: [
        {
          name: 'Dirección IP',
          type: 'text',
          placeholder: '0.0.0.0',
          value: this.ip,
        },
        {
          name: 'Puerto',
          type: 'text',
          id: 'port',
          value: this.port,
          placeholder: '0000'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }




}


