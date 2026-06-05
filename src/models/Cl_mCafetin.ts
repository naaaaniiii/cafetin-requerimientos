import Cl_mPedido from "./Cl_mPedido.js";

export default class Cafetin {
  private _tasaCambio: number;
  private _pedidos: Cl_mPedido[] = [];

  constructor(tasaInicial: number = 0) {
    this._tasaCambio = tasaInicial;
  }

  public get tasaCambio(): number { 
    return this._tasaCambio; 
}
  public set tasaCambio(nuevaTasa: number) { 
    this._tasaCambio = nuevaTasa;
 }

  public setPedidos(arrayPlanos: any[]) {
    this._pedidos = [];
    arrayPlanos.forEach((p) => {
      this._pedidos.push(
        new Cl_mPedido({
          id: p.id || p._id,
          nombre: p.nombre,
          cedula: p.cedula,
          resumenProductos: p.resumenProductos,
          montoTotal$: Number(p.montoTotal$),
          montoTotalBs: Number(p.montoTotalBs),
          cuentaOrigen: p.cuentaOrigen,
          cuentaDestino: p.cuentaDestino,
          referencia: p.referencia,
          status: p.status,
          fecha: p.fecha,
        })
      );
    });
  }

  public calcularTotalPedidos(): number {
    return this._pedidos.length;
  }

  public calcularPendientes(): number {
    return this._pedidos.filter(p => p.status === "pendiente").length;
  }

  public calcularAceptados(): number {
    return this._pedidos.filter(p => p.status === "aceptado").length;
  }

  public calcularRechazados(): number {
    return this._pedidos.filter(p => p.status === "rechazado").length;
  }

  public calcularMontoAceptadoUsd(): number {
    return this._pedidos
      .filter(p => p.status === "aceptado")
      .reduce((acum, p) => acum + p.montoTotal$, 0);
  }

  public calcularMontoAceptadoBs(): number {
    return this.calcularMontoAceptadoUsd() * this._tasaCambio;
  }

  // MÉTODO PARA CONSULTAR LA CANTIDAD DE PRODUCTOS VENDIDOS EN UNA FECHA INDICADA
  public calcularCantidadPorProductoYFecha(productoNombre: string, fechaIndicada: string): number {
    let totalUnidades = 0;
    const productoBuscar = productoNombre.trim().toLowerCase();
    this._pedidos.forEach(pedido => {
      if (pedido.fecha === fechaIndicada && pedido.status === "aceptado") {
        const desgloses = pedido.desglosarCantidades();
        desgloses.forEach(item => {
          if (item.producto.trim().toLowerCase() === productoBuscar) {
            totalUnidades += item.cantidad;
          }
        });
      }
    });
    return totalUnidades;
  }

  // MÉTODO CORREGIDO: Cuenta de forma segura sin importar mayúsculas/minúsculas ni espacios vacíos
  public obtenerProductoMasPedido(): string {
    const conteoGlobal: { [key: string]: number } = {};
    const formatoOriginal: { [key: string]: string } = {}; // Guarda el nombre bonito original para mostrarlo en el dashboard

    this._pedidos.forEach(pedido => {
      if (pedido.status === "aceptado") {
        const desgloses = pedido.desglosarCantidades();
        desgloses.forEach(item => {
          if (item.producto) {
            const nombreLimpio = item.producto.trim().toLowerCase();
            conteoGlobal[nombreLimpio] = (conteoGlobal[nombreLimpio] || 0) + item.cantidad;
            formatoOriginal[nombreLimpio] = item.producto.trim(); // Guarda "Empanada de Pollo" en vez de "empanada de pollo"
          }
        });
      }
    });

    let productoMasVendidoClave = "";
    let maxCantidad = 0;

    for (const clave in conteoGlobal) {
      if (conteoGlobal[clave] > maxCantidad) {
        maxCantidad = conteoGlobal[clave];
        productoMasVendidoClave = clave;
      }
    }

    if (maxCantidad > 0 && productoMasVendidoClave !== "") {
      return `${formatoOriginal[productoMasVendidoClave]} (${maxCantidad} unds)`;
    }

    return "Ninguno";
  }
}