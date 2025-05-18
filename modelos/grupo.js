class Grupo {
  constructor(
    id,
    descripcion,
    fecha,
    usuarioId,
    usuarioNombre,
    residentes = [],
  ) {
    this.id = id;
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.usuarioId = usuarioId;
    this.usuarioNombre = usuarioNombre;
    this.residentes = residentes;
  }
}

export default Grupo;
