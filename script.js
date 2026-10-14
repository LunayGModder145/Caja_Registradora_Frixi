// 1. CONFIGURACIÓN INICIAL DE LA CAJA
// 
// Los valores están expresados en céntimos (ejemplo: 50000 = 500€) para evitar errores de redondeo de punto flotante en JS.
const CajaRegistradora = [
    { tipo: "Billetes", valor: 50000, cantidad: 0 },
    { tipo: "Billetes", valor: 20000, cantidad: 0 },
    { tipo: "Billetes", valor: 10000, cantidad: 0 },
    { tipo: "Billetes", valor: 5000, cantidad: 1 },
    { tipo: "Billetes", valor: 2000, cantidad: 4 },
    { tipo: "Billetes", valor: 1000, cantidad: 8 },
    { tipo: "Billetes", valor: 500, cantidad: 2 },
    { tipo: "Moneda", valor: 200, cantidad: 5 },
    { tipo: "Moneda", valor: 100, cantidad: 4 },
    { tipo: "Moneda", valor: 50, cantidad: 0 },
    { tipo: "Moneda", valor: 20, cantidad: 0 },
    { tipo: "Moneda", valor: 10, cantidad: 1 },
    { tipo: "Moneda", valor: 5, cantidad: 2 },
    { tipo: "Moneda", valor: 2, cantidad: 3 },
    { tipo: "Moneda", valor: 1, cantidad: 1 },
];


// 2. DATOS DE LA VENTA

// Precio del artículo (ejemplo: 15,50 € significan 1550 céntimos. Puedes cambiarlo a conveniencia)
const precioArticulo = 1550;

// Desglose del dinero entregado por el cliente
const dineroEntregadoDesglose = [
  { tipo: "Billete", valor: 50000, cantidad: 0 },
  { tipo: "Billete", valor: 20000, cantidad: 0 },
  { tipo: "Billete", valor: 10000, cantidad: 0 },
  { tipo: "Billete", valor: 5000, cantidad: 0 },
  { tipo: "Billete", valor: 2000, cantidad: 1 }, // Esto equivale a que el cliente entrega 1 billete de 20€
  { tipo: "Billete", valor: 1000, cantidad: 0 }, 
  { tipo: "Billete", valor: 500, cantidad: 0 },
  { tipo: "Moneda", valor: 200, cantidad: 0 },
  { tipo: "Moneda", valor: 100, cantidad: 0 },
  { tipo: "Moneda", valor: 50, cantidad: 1 },
  { tipo: "Moneda", valor: 20, cantidad: 0 },
  { tipo: "Moneda", valor: 10, cantidad: 0 },
  { tipo: "Moneda", valor: 5, cantidad: 0 },
  { tipo: "Moneda", valor: 2, cantidad: 5 },
  { tipo: "Moneda", valor: 1, cantidad: 0 }
];


// 3. PROCESAMIENTO DEL PAGO

let totalDineroEntregado = 0;

// Recorremos el desglose del cliente para sumar el total e ingresarlo a la caja
for (let i = 0; i < CajaRegistradora.length; i++) {
    totalDineroEntregado += dineroEntregadoDesglose[i].valor * dineroEntregadoDesglose[i].cantidad;
    CajaRegistradora[i].cantidad += dineroEntregadoDesglose[i].cantidad;
}

// Calculamos la diferencia entre lo entregado y el precio
const cambioTotal = totalDineroEntregado - precioArticulo;
console.log("Cambio total a devolver:", cambioTotal);



// 4. VALIDACIONES Y CÁLCULO DEL CAMBIO (GREEDY)

if(cambioTotal < 0) {
    console.log("El dinero entregado no es suficiente");
} else if (cambioTotal === 0) {
    console.log("El pago es exacto, disfrute su compra y vuelva pronto");
} else {
    let cambioRestante = cambioTotal;
    let cambioDevueltoDesglose = [];

    // Algoritmo greedy: recorre de mayor a menor denominación buscando dar el cambio óptimo
    for (let item of CajaRegistradora) {
        const necesarios = Math.floor(cambioRestante / item.valor); 
        // 1. ¿Cuántas unidades completas de esta denominación caben en el cambio que falta?
        const aDevolver = Math.min(necesarios, item.cantidad); 
        // 2. ¿Tenemos suficiente stock? Nos quedamos con el menor (lo que necesitamos o lo que hay)

        if(aDevolver > 0) {
           cambioRestante -= aDevolver * item.valor;
           item.cantidad -= aDevolver; // Descontamos del stock definitivo de la caja

           // Guardamos el desglose exacto que se le entregará al cliente
           cambioDevueltoDesglose.push({ tipo: item.tipo, valor: item.valor, cantidad: aDevolver });
        
           // Si ya cubrimos todo el cambio, rompemos el bucle por eficiencia
           if (cambioRestante === 0) {
                break;
           }
        }
    }

    // Comprobamos si la caja se quedó sin denominaciones suficientes para completar el cambio
    if (cambioRestante > 0) {
        console.log("No hay suficiente cambio en la caja.");
    } else {
        console.log("¡Cambio calculado con éxito!");
        console.log("Desglose del cambio:", cambioDevueltoDesglose);
        console.log("Nuevo estado de la caja:", CajaRegistradora);
    }
}


/* 
   RESUMEN DE LA CAJA: 
   
   1. Control de decimales (Céntimos): 
   Usamos números enteros para evitar los errores de 
   precisión en punto flotante (estándar IEEE 754) de JavaScript.
          
   2. Enfoque Greedy (Algoritmo Voraz): 
    Recorremos las denominaciones de mayor a menor para que el desglose 
    siempre sea el más óptimo (usando la menor cantidad de piezas).
        
   3. Gestión del Estado: 
     El pago del cliente se inyecta al stock de la caja *antes* de calcular.
     El "break" optimiza el proceso deteniendo el bucle al llegar a 0.
     Si el bucle termina y `cambioRestante > 0`, significa que la caja 
     no tiene suficientes piezas físicas para completar la devolución.
*/