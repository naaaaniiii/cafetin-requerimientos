import Cl_mPedido from "../models/Cl_mPedido.js";
import Cl_sMockApi from "./Cl_sMockApi.js";

export default class Cl_sPedido extends Cl_sMockApi {
  private static urlPedidos = "https://6a14ae806c7db8aac054d899.mockapi.io/pedidos";
  private static urlProductos = "https://6a14ae806c7db8aac054d899.mockapi.io/productos";
  private static urlConfig = "https://6a1730e11b90031f81b2232e.mockapi.io/configuracion/1";
  private static urlCuentas = "https://6a1730e11b90031f81b2232e.mockapi.io/cuentasBancarias";

  static async obtenerProductos(): Promise<any[]> {
    return await this.get(this.urlProductos);
  }

  static async obtenerCuentasDestino(): Promise<any[]> {
    return await this.get(this.urlCuentas);
  }

  static async obtenerTasaDinamica(): Promise<number> {
    const data = await this.get(this.urlConfig);
    return data && data.tasaCambio ? parseFloat(data.tasaCambio) : 40.0;
  }

  static async consultarEstadoPedido(cedula: number): Promise<any[]> {
    return await this.get(`${this.urlPedidos}?cedula=${cedula}`);
  }

  static async guardarPedido(nuevoPedido: Cl_mPedido): Promise<{ ok: boolean; mensaje: string }> {
    try {
      const resData = await this.post(this.urlPedidos, nuevoPedido);
      if (!resData) {
        return { ok: false, mensaje: "Error al registrar el pedido." };
      }
      return { ok: true, mensaje: "¡Pedido enviado! Orden Nro: " + resData.id };
    } catch (error: any) {
      return { ok: false, mensaje: "Error de red: " + error.message };
    }
  }
}