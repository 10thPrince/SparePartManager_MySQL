import { db } from "../config/db.js";

const getStockOutTotal = (unitPrice, quantity) => {
    return Number(unitPrice || 0) * Number(quantity || 0);
}

export const createStockOut = (req, res) => {
    try {
        const { sparePartId, quantity, stockOutDate } = req.body;
        const requestedQuantity = Number(quantity);

        if (!sparePartId || !requestedQuantity || !stockOutDate) {
            return res.status(400).json({
                success: false,
                message: "Please Fill in all required fields!"
            })
        }

        if (requestedQuantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than zero."
            })
        }

        const q = "SELECT * FROM spareparts WHERE SparePartId = ?";
        db.query(q, [sparePartId], (err, result) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    Error: err
                })
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid Spare Part ID! Spare Part Not Found."
                })
            }

            const sparePart = result[0];
            const availableQuantity = Number(sparePart.Quantity || 0);

            if (availableQuantity < requestedQuantity) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock available. Current quantity is ${availableQuantity}.`
                })
            }

            const unitPrice = Number(sparePart.UnitPrice || 0);
            const totalPrice = getStockOutTotal(unitPrice, requestedQuantity);
            const q = "INSERT INTO stockout (SparePartId, Quantity, UnitPrice, TotalPrice, StockOutDate) VALUES (?, ?, ?, ?, ?)";

            db.query(q, [sparePartId, requestedQuantity, unitPrice, totalPrice, stockOutDate], (err) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        Error: err
                    })
                }

                const q = "UPDATE spareparts SET Quantity = Quantity - ? WHERE SparePartId = ?";
                db.query(q, [requestedQuantity, sparePartId], (err) => {
                    if (err) {
                        return res.status(400).json({
                            success: false,
                            Error: err
                        })
                    }

                    res.status(201).json({
                        success: true,
                        message: "Spare Part Stock Out Recorded Successfully!"
                    })
                })
            })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "System Error",
            err: error
        })
    }
}

export const getAllStockOut = (req, res) => {
    try {
        const q = "SELECT * FROM stockout";
        db.query(q, (err, result) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    Error: err
                })
            }

            res.status(200).json({
                success: true,
                count: result.length,
                data: result
            })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "System Error",
            err: error
        })
    }
}

export const getOneStockOut = (req, res) => {
    try {
        const { id } = req.params;
        const q = "SELECT * FROM stockout WHERE StockOutId = ?";

        db.query(q, [id], (err, result) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    Error: err
                })
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid Id! No Stock Out Record Found"
                })
            }

            res.status(200).json({
                success: true,
                data: result
            })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "System Error",
            err: error
        })
    }
}

export const updateStockOut = (req, res) => {
    try {
        const { sparePartId, quantity, stockOutDate } = req.body;
        const { id } = req.params;
        const requestedQuantity = Number(quantity);

        if (!sparePartId || !requestedQuantity || !stockOutDate) {
            return res.status(400).json({
                success: false,
                message: "Please Fill in all required fields!"
            })
        }

        if (requestedQuantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than zero."
            })
        }

        const q = "SELECT * FROM stockout WHERE StockOutId = ?";
        db.query(q, [id], (err, result) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    Error: err
                })
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Invalid Id! The Stock Out Record of ID ${id} was not found.`
                })
            }

            const oldStockOut = result[0];
            const q = "SELECT * FROM spareparts WHERE SparePartId IN (?, ?)";

            db.query(q, [oldStockOut.SparePartId, sparePartId], (err, spareResults) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        Error: err
                    })
                }

                const oldSparePart = spareResults.find((spare) => Number(spare.SparePartId) === Number(oldStockOut.SparePartId));
                const newSparePart = spareResults.find((spare) => Number(spare.SparePartId) === Number(sparePartId));

                if (!newSparePart) {
                    return res.status(404).json({
                        success: false,
                        message: "Invalid Spare Part ID! Spare Part Not Found."
                    })
                }

                const restoredOldQuantity = Number(oldSparePart?.Quantity || 0) + Number(oldStockOut.Quantity || 0);
                const availableQuantity = Number(oldStockOut.SparePartId) === Number(sparePartId)
                    ? restoredOldQuantity
                    : Number(newSparePart.Quantity || 0);

                if (availableQuantity < requestedQuantity) {
                    return res.status(400).json({
                        success: false,
                        message: `Not enough stock available. Current quantity is ${availableQuantity}.`
                    })
                }

                const unitPrice = Number(newSparePart.UnitPrice || 0);
                const totalPrice = getStockOutTotal(unitPrice, requestedQuantity);
                const q = "UPDATE stockout SET SparePartId = ?, Quantity = ?, UnitPrice = ?, TotalPrice = ?, StockOutDate = ? WHERE StockOutId = ?";

                db.query(q, [sparePartId, requestedQuantity, unitPrice, totalPrice, stockOutDate, id], (err) => {
                    if (err) {
                        return res.status(400).json({
                            success: false,
                            Error: err
                        })
                    }

                    const q = "UPDATE spareparts SET Quantity = Quantity + ? WHERE SparePartId = ?";
                    db.query(q, [oldStockOut.Quantity, oldStockOut.SparePartId], (err) => {
                        if (err) {
                            return res.status(400).json({
                                success: false,
                                Error: err
                            })
                        }

                        const q = "UPDATE spareparts SET Quantity = Quantity - ? WHERE SparePartId = ?";
                        db.query(q, [requestedQuantity, sparePartId], (err) => {
                            if (err) {
                                return res.status(400).json({
                                    success: false,
                                    Error: err
                                })
                            }

                            res.status(200).json({
                                success: true,
                                message: "Stock Out Record Updated Successfully!"
                            })
                        })
                    })
                })
            })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "System Error",
            err: error
        })
    }
}

export const deleteStockOut = (req, res) => {
    try {
        const { id } = req.params;
        const q = "SELECT * FROM stockout WHERE StockOutId = ?";

        db.query(q, [id], (err, result) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    Error: err
                })
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid ID! The Stock Out Record was not found."
                })
            }

            const oldStockOut = result[0];
            const q = "UPDATE spareparts SET Quantity = Quantity + ? WHERE SparePartId = ?";

            db.query(q, [oldStockOut.Quantity, oldStockOut.SparePartId], (err) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        Error: err
                    })
                }

                const q = "DELETE FROM stockout WHERE StockOutId = ?";
                db.query(q, [id], (err) => {
                    if (err) {
                        return res.status(400).json({
                            success: false,
                            Error: err
                        })
                    }

                    res.status(200).json({
                        success: true,
                        message: "Stock Out Record Deleted Successfully!"
                    })
                })
            })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "System Error",
            err: error
        })
    }
}
