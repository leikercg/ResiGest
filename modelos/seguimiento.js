class Seguimiento {
  constructor(id, departamentoId, residenteId, detalles = []) {
    // Está vacio por defecto si no se le pasa nada
    this.id = id;
    this.departamentoId = departamentoId;
    this.residenteId = residenteId;
    this.detalles = detalles;
  }
}

export default Seguimiento;
