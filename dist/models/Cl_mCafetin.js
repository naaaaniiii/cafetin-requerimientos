import Cl_mPedido from "./Cl_mPedido.js";
export default class Cafetin {
    _tasaCambio;
    _pedidos = [];
    constructor(tasaInicial = 0) {
        this._tasaCambio = tasaInicial;
    }
    get tasaCambio() {
        return this._tasaCambio;
    }
    set tasaCambio(nuevaTasa) {
        this._tasaCambio = nuevaTasa;
    }
    setPedidos(arrayPlanos) {
        this._pedidos = [];
        arrayPlanos.forEach((p) => {
            this._pedidos.push(new Cl_mPedido({
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
            }));
        });
    }
    calcularTotalPedidos() {
        return this._pedidos.length;
    }
    calcularPendientes() {
        return this._pedidos.filter(p => p.status === "pendiente").length;
    }
    calcularAceptados() {
        return this._pedidos.filter(p => p.status === "aceptado").length;
    }
    calcularRechazados() {
        return this._pedidos.filter(p => p.status === "rechazado").length;
    }
    calcularMontoAceptadoUsd() {
        return this._pedidos
            .filter(p => p.status === "aceptado")
            .reduce((acum, p) => acum + p.montoTotal$, 0);
    }
    calcularMontoAceptadoBs() {
        return this.calcularMontoAceptadoUsd() * this._tasaCambio;
    }
    // MÉTODO PARA CONSULTAR LA CANTIDAD DE PRODUCTOS VENDIDOS EN UNA FECHA INDICADA
    calcularCantidadPorProductoYFecha(productoNombre, fechaIndicada) {
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
    obtenerProductoMasPedido() {
        const conteoGlobal = {};
        const formatoOriginal = {}; // Guarda el nombre bonito original para mostrarlo en el dashboard
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
//# sourceMappingURL=Cl_mCafetin.js.map