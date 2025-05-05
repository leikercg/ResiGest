class Cura {
  constructor(
    id,
    fecha,
    zona,
    observacion,
    residenteId,
    usuarioId,
    usuarioNombre,
  ) {
    this.id = id;
    this.fecha = fecha;
    this.zona = zona;
    this.observacion = observacion;
    this.residenteId = residenteId;
    this.usuarioId = usuarioId;
    this.usuarioNombre = usuarioNombre;
  }
}

export default Cura;
