class Sesion {
  constructor(
    id,
    fecha,
    descripcion,
    residenteId,
    usuarioId,
    usuarioNombre,
    residenteNombre,
  ) {
    this.id = id;
    this.fecha = fecha;
    this.descripcion = descripcion;
    this.residenteId = residenteId;
    this.usuarioId = usuarioId;
    this.usuarioNombre = usuarioNombre;
    this.residenteNombre = residenteNombre;
  }
}

export default Sesion;
