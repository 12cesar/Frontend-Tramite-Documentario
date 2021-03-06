import { Component, OnInit } from '@angular/core';
import { urlBack } from 'src/app/api/apiTramite';
import {
  DocumentoInterno,
  DocumentoInternoResult,
} from 'src/app/interface/documento-interno.interface';
import { DocumentoInternoService } from 'src/app/services/documento-interno.service';
import { TramiteInternoService } from 'src/app/services/tramite-interno.service';
import { WebsocketService } from 'src/app/socket/websocket.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-mostrar-documento-interno',
  templateUrl: './mostrar-documento-interno.component.html',
  styleUrls: ['./mostrar-documento-interno.component.css'],
})
export class MostrarDocumentoInternoComponent implements OnInit {
  listDocumento?: DocumentoInterno[];
  derivarForm = {
    codigoDoc: '',
    observacion: '',
    accion: '',
  };
  url = urlBack;
  idArea=sessionStorage.getItem('area');
  constructor(
    private documentoService: DocumentoInternoService,
    private tramiteService: TramiteInternoService,
    private wsService:WebsocketService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.mostrarDocumentos();
    this.verFirmaInterno();
  }
  mostrarDocumentos() {
    this.documentoService.getDocumentosInternos().subscribe(
      (data: DocumentoInternoResult) => {
        this.listDocumento = data.documentoInter;
        for (let i = 0; i < this.listDocumento.length; i++) {
          this.listDocumento[i].codigo =
            this.listDocumento[i].codigoDocumento?.split('-')[1];
          this.listDocumento[i].tipo =
            this.listDocumento[i].codigoDocumento?.split('-')[2];
        }
        console.log(this.listDocumento);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  asignarCod(codigo: any) {
    this.derivarForm.codigoDoc = codigo;
  }
  derivar() {
    const data = new FormData();
    data.append('observacion', this.derivarForm.observacion);
    data.append('codigoDocumento', this.derivarForm.codigoDoc);
    data.append('accion', this.derivarForm.accion);
    this.tramiteService.postTramiteInterno(data).subscribe(
      (data) => {
        console.log(data);
        this.mostrarDocumentos();
        this.cancelar();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  cancelar() {
    this.derivarForm = {
      codigoDoc: '',
      observacion: '',
      accion: '',
    };
  }
  verFirmaInterno() {
    const area = sessionStorage.getItem('area');
    this.wsService.listen(`agregar-firma-interno-${area}`).subscribe(
      (data) => {
        this.mostrarDocumentos();
        this.toastr.success('Se creo Firmo documento interno', 'Firmado');
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
