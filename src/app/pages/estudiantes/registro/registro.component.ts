import { Component, OnInit } from '@angular/core';
import { Estudiante } from '../../../models/Estudiante';
import { EstudianteService } from '../../../services/estudiante.service';
import { Eventos } from '../../../models/Eventos';
import { EventosService } from '../../../services/eventos.service';
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Paquetes } from '../../../models/Paquetes';
import { PaquetesService } from '../../../services/paquetes.service';
import { AuthService } from '../../../services/auth.service';
import { Admin } from '../../../models/Admin';

@Component({
	selector: 'app-registro',
	templateUrl: './registro.component.html',
	styleUrls: ['./registro.component.css'],
	providers: [MessageService]
})
export class RegistroComponent implements OnInit {

	estudianteNew: Estudiante = new Estudiante();
	passwordRepeat: string;

	paquetesList: Paquetes[];
	// paqueteSeleccionado: Paquetes = new Paquetes();

	// toggle webcam on/off
	public showWebcam = true;
	public allowCameraSwitch = true;
	public multipleWebcamsAvailable = false;
	public deviceId: string;
	public videoOptions: MediaTrackConstraints = {
		// width: {ideal: 1024},
		// height: {ideal: 576}
	};
	public errors: WebcamInitError[] = [];

	// latest snapshot
	public webcamImage: WebcamImage = null;

	// webcam snapshot trigger
	private trigger: Subject<void> = new Subject<void>();
	// switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
	private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

	constructor(
		private router: Router,
		private authService: AuthService,
		private messageService: MessageService,
		private estudianteService: EstudianteService,
		private paquetesService: PaquetesService
	) { }

	ngOnInit(): void {
		this.paquetesService.obtenerTodo().then(res => this.paquetesList = res);

		WebcamUtil.getAvailableVideoInputs()
			.then((mediaDevices: MediaDeviceInfo[]) => {
				this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
			});
	}

	public handleInitError(error: WebcamInitError): void {
		this.errors.push(error);
	}

	public cameraWasSwitched(deviceId: string): void {
		console.log('active device: ' + deviceId);
		this.deviceId = deviceId;
	}

	public handleImage(webcamImage: WebcamImage): void {
		console.info('received webcam image', webcamImage);
		this.webcamImage = webcamImage;
	}

	public get triggerObservable(): Observable<void> {
		return this.trigger.asObservable();
	}

	public triggerSnapshot(): void {
		this.trigger.next();
	}

	public get nextWebcamObservable(): Observable<boolean | string> {
		return this.nextWebcam.asObservable();
	}

	public registrarEstudiante(): void {
		try {
			
			// this.estudianteNew.idpaquetes = this.paqueteSeleccionado.idpaquetes;
			this.estudianteService.guardarEstudiante(this.estudianteNew).subscribe(
				res => {
					let entity: Admin = new Admin();

					entity.administradorUsuario = this.estudianteNew.matriculaestudiantes + "";
					entity.administradorPassword = this.estudianteNew.passwordestudiante;

					this.authService.loginEstudiante(entity).subscribe(
						res => {
							localStorage.setItem('token', res['token']);
							localStorage.setItem('isAdmin', 'false');
							localStorage.setItem('isOperador', 'false');
							localStorage.setItem('isEstudiante', 'true');
							let estudiante = res['result'];
							// console.log(estudiante[0]);
							
							localStorage.setItem('estudianteLogin', JSON.stringify(estudiante[0]));
							this.router.navigate(['estudiante/dashboard']);
						}
					);
				},
				err => {
					this.showMensaje('error', 'Alerta', 'No se pudo guardar');
				}
			);
		} catch (error) {
			this.showMensaje('warn', 'Alerta', 'No se pudo guardar');
		}
	}

	showMensaje(severity, summary, details) {
		this.messageService.add({ severity: severity, summary: summary, detail: details });
	}

}
