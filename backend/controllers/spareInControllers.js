import { db } from "../config/db.js";

export const createSpareIn = (req, res) => {
    try {
        const { sparePartId, quantity, spareInDate } = req.body;

        if (!sparePartId || !quantity || !spareInDate) {
            return res.status(400).json({
                success: false,
                message: "Please Fill in all required fields!"
            })
        }

        const q = "SELECT * FROM spareparts WHERE SparePartId = ?"
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
                    message: "Invalid Spare Part ID! SPare Part Not Found."
                })
            }

            if (result.length !== 0) {
                const sparePart = result[0];


                const q = "INSERT INTO stockin (SparePartId, Quantity, StockInDate) VALUE(?, ?, ?)";
                db.query(q, [sparePartId, quantity, spareInDate], (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            success: false,
                            Error: err
                        })
                    }

                    const q = `UPDATE spareparts SET Quantity = Quantity + ? WHERE SparePartId = ?`;
                    db.query(q, [quantity, sparePartId], (err, result) => {
                        if (err) {
                            return res.status(400).json({
                                success: false,
                                Error: err
                            })
                        }

                        res.status(201).json({
                            success: true,
                            message: "Added New Quantity of Spare Parts In Successfully!"
                        })
                    })
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "System Error",
            err: error
        })
    }
}

export const getAllSpareIn = (req, res) => {
    try {
        const q = "SELECT * FROM stockin";
        db.query(q, (err, result) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    Error: err
                })
            }

            if (result.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: "All Good but no Spare Part Stock In Found!",
                    data: result
                })
            }

            if (result.length !== 0) {
                res.status(200).json({
                    success: true,
                    count: result.length,
                    data: result
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "System Error",
            err: error
        })
    }
}

export const getOneSpareIn = (req, res) => {
    try {
        const { id } = req.params;

        const q = "SELECT * FROM stockin WHERE StockInId = ?";
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
                    message: "Invalid Id! No Stock IN Record Found"
                })
            }

            if (result.length !== 0) {
                res.status(200).json({
                    success: true,
                    data: result
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "System Error",
            err: error
        })
    }
}

export const updateSpareIn = (req, res) => {
    try {
        const { sparePartId, quantity, spareInDate } = req.body;
        const { id } = req.params;

        if (!sparePartId || !quantity || !spareInDate) {
            return res.status(400).json({
                success: false,
                message: "Please Fill in all required fields!"
            })
        }

        const q = "SELECT * FROM stockin WHERE StockInId = ?";
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
                    message: `Invalid Id! The Spare Part In RECORD of ID ${id} NOT FOUND!`
                })
            }
            if (result.length !== 0) {
                const oldStockIn = result[0];
                const q = "UPDATE stockin SET SparePartId = ?, Quantity = ?, StockInDate = ? WHERE StockInId = ?";
                db.query(q, [sparePartId, quantity, spareInDate, id], (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            success: false,
                            Error: err
                        })
                    }
                    const q = "UPDATE spareparts SET Quantity = Quantity - ? WHERE SparePartId = ?";
                    db.query(q, [oldStockIn.Quantity, oldStockIn.SparePartId], (err, result) => {
                        if (err) {
                            return res.status(400).json({
                                success: false,
                                Error: err
                            })
                        }

                        const q = "UPDATE spareparts SET Quantity = Quantity + ? WHERE SparePartId = ?";
                        db.query(q, [quantity, sparePartId], (err, result) => {
                            if (err) {
                                return res.status(400).json({
                                    success: false,
                                    Error: err
                                })
                            }
                            res.status(200).json({
                                success: true,
                                message: "Updated The Spare Part StockIn Successfully!"
                            })
                        })
                    })
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "System Error",
            err: error
        })
    }
}

export const deleteSpareIn = (req, res) => {
    try {
        const { id } = req.params;

        const q = "SELECT * FROM stockin WHERE StockInId = ?";
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
                    message: "Invalid ID! The Spare Part Stock IN Record Not Found!"
                })
            }
            if (result.length !== 0) {
                const oldStockIn = result[0];
                const q = "UPDATE spareparts SET Quantity = Quantity - ? WHERE SparePartId = ?";
                db.query(q, [oldStockIn.Quantity, oldStockIn.SparePartId], (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            success: false,
                            Error: err
                        })
                    }

                    const q = "DELETE FROM stockin WHERE StockInId = ?";
                    db.query(q, [id], (err, result) => {
                        if (err) {
                            return res.status(400).json({
                                success: false,
                                Error: err
                            })
                        }
                        res.status(200).json({
                            success: true,
                            message: "Spare Part Stock In Record Deleted Successfully!"
                        })
                    })
                })


            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "System Error",
            err: error
        })
    }
}