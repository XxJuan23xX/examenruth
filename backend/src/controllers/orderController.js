const moment = require('moment');
const { poolPromise } = require('../../config/db');
const sql = require('mssql');

// Crear pedido
const createOrder = async (req, res) => {
    const userID = req.user.userID;
    const { products, total, estado } = req.body;

    let transaction;

    try {
        const pool = await poolPromise;
        transaction = new sql.Transaction(pool);

        await transaction.begin();

        const request = new sql.Request(transaction);
        const result = await request
            .input('ClienteID', sql.Int, userID)
            .input('FechaPedido', sql.DateTime, moment().format('YYYY-MM-DD HH:mm:ss'))
            .input('Total', sql.Decimal(10, 2), total)
            .input('Estado', sql.NVarChar(50), estado)
            .query(`
                INSERT INTO Pedidos (ClienteID, FechaPedido, Total, Estado)
                VALUES (@ClienteID, @FechaPedido, @Total, @Estado);
                SELECT SCOPE_IDENTITY() AS PedidoID;
            `);

        const pedidoID = result.recordset[0].PedidoID;

        for (const product of products) {
            const detalleRequest = new sql.Request(transaction);

            await detalleRequest
                .input('DetallePedidoID', sql.Int, pedidoID)
                .input('ProductoDetalleID', sql.Int, product.ProductoID)
                .input('CantidadDetalle', sql.Int, product.Cantidad)
                .input('PrecioUnitarioDetalle', sql.Decimal(10, 2), product.Precio)
                .input('SubtotalDetalle', sql.Decimal(10, 2), product.Cantidad * product.Precio)
                .query(`
                    INSERT INTO DetallesPedido (PedidoID, ProductoID, Cantidad, PrecioUnitario, Subtotal)
                    VALUES (@DetallePedidoID, @ProductoDetalleID, @CantidadDetalle, @PrecioUnitarioDetalle, @SubtotalDetalle);
                `);

            const stockRequest = new sql.Request(transaction);

            await stockRequest
                .input('ProductoIDStock', sql.Int, product.ProductoID)
                .input('CantidadStock', sql.Int, product.Cantidad)
                .query(`
                    UPDATE Productos
                    SET Stock = Stock - @CantidadStock
                    WHERE ProductoID = @ProductoIDStock;
                `);
        }

        await transaction.commit();

        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'An error occurred while creating the order' });
    }
};

// Obtener historial de pedidos
const getOrderHistory = async (req, res) => {
    const userID = req.user.userID;

    try {
        const pool = await poolPromise;
        const request = new sql.Request(pool);

        const result = await request
            .input('ClienteID', sql.Int, userID)
            .query(`
                SELECT 
                    p.PedidoID, 
                    p.FechaPedido, 
                    p.Total, 
                    dp.ProductoID, 
                    dp.Cantidad, 
                    dp.PrecioUnitario, 
                    pr.Nombre AS NombreProducto, 
                    pr.Imagen
                FROM 
                    Pedidos p
                INNER JOIN 
                    DetallesPedido dp ON p.PedidoID = dp.PedidoID
                INNER JOIN 
                    Productos pr ON dp.ProductoID = pr.ProductoID
                WHERE 
                    p.ClienteID = @ClienteID
                ORDER BY 
                    p.FechaPedido DESC;
            `);

        const orders = result.recordset.reduce((acc, row) => {
            const { PedidoID, FechaPedido, Total, ProductoID, Cantidad, PrecioUnitario, NombreProducto, Imagen } = row;
            const order = acc.find(o => o.PedidoID === PedidoID);

            if (order) {
                order.detalles.push({ ProductoID, Cantidad, PrecioUnitario, NombreProducto, Imagen });
            } else {
                acc.push({
                    PedidoID,
                    FechaPedido,
                    Total,
                    detalles: [{ ProductoID, Cantidad, PrecioUnitario, NombreProducto, Imagen }]
                });
            }

            return acc;
        }, []);

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ error: 'An error occurred while fetching order history' });
    }
};

const getOrdersForAdmin = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT p.PedidoID, p.ClienteID, p.FechaPedido, p.Total, d.ProductoID, d.Cantidad, d.PrecioUnitario, pr.Nombre, pr.Imagen
            FROM Pedidos p
            JOIN DetallesPedido d ON p.PedidoID = d.PedidoID
            JOIN Productos pr ON d.ProductoID = pr.ProductoID
        `);

        const orders = result.recordset.reduce((acc, row) => {
            const order = acc.find(o => o.PedidoID === row.PedidoID);
            if (order) {
                order.productos.push({
                    ProductoID: row.ProductoID,
                    Nombre: row.Nombre,
                    Imagen: row.Imagen,
                    Precio: row.PrecioUnitario,
                    Cantidad: row.Cantidad
                });
            } else {
                acc.push({
                    PedidoID: row.PedidoID,
                    ClienteID: row.ClienteID,
                    FechaPedido: row.FechaPedido,
                    Total: row.Total,
                    productos: [{
                        ProductoID: row.ProductoID,
                        Nombre: row.Nombre,
                        Imagen: row.Imagen,
                        Precio: row.PrecioUnitario,
                        Cantidad: row.Cantidad
                    }]
                });
            }
            return acc;
        }, []);

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'An error occurred while fetching orders' });
    }
};

module.exports = {
    createOrder,
    getOrderHistory,
    getOrdersForAdmin
};
