class Grupo {
  constructor(
    id,
    descripcion,
    fecha,
    usuarioId,
    nombreUsuario,
    residentes = [],
  ) {
    this.id = id;
    this.descripcion = descripcion;
    this.fecha = fecha;
    this.usuarioId = usuarioId;
    this.nombreUsuario = nombreUsuario;
    this.residentes = residentes;
  }
}

export default Grupo;
