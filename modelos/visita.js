class Visita {
  constructor(
    id,
    fecha,
    motivo,
    residenteId,
    usuarioId,
    usuarioNombre,
    residenteNombre,
  ) {
    this.id = id;
    this.fecha = fecha;
    this.motivo = motivo;
    this.residenteId = residenteId;
    this.usuarioId = usuarioId;
    this.usuarioNombre = usuarioNombre;
    this.residenteNombre = residenteNombre;
  }
}

export default Visita;
