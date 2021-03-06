// Generated by https://quicktype.io

export interface ResultSeguimientoInter {
    ok:          boolean;
    seguimiento: Seguimiento[];
}

export interface Seguimiento {
    id:             number;
    fechaDerivado:  string;
    horaDerivado:   string;
    fechaRecepcion: null | string;
    horaRecepcion:  null | string;
    codigoTramite:  string;
    idDestino:      number;
    Area:           Area;
}

export interface Area {
    id:              number;
    nombre:          string;
    sigla:           string;
    textoNumeracion: string;
    habilitado:      number;
    idDireccion:     number;
}
