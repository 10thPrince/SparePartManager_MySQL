import { db } from "../config/db.js";


export const createSparePart = (req, res) => {
    try {
        const { spareName, category, unitPrice, quantity } = req.body;

        if (!spareName || !unitPrice) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required Fileds!"
            })
        }

        const q = "INSERT INTO spareparts(SparePartName, Category, UnitPrice, Quantity) VALUES(?, ?, ?, ?)";
        db.query(q, [spareName, category, unitPrice, quantity], (err, result) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    Error: err
                })
            }

            res.status(201).json({
                success: true,
                message: "A new Spare Part created Successfully"
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

export const getAllSpares = (req, res) => {
    try {

        const q = "SELECT * FROM spareparts";
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
                    message: "No SPare Part Found",
                    data: result
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

export const getOneSpare = (req, res) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Please Insert the Id of the Spare part!"
            })
        }

        const q = "SELECT * FROM spareparts WHERE SparePartId = ?";
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
                    message: `The spare part with the id: ${id} do not exist in Our Database! Insert a valid Id`
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

export const updateSpare = (req, res) => {
    try {
        const { spareName, category, unitPrice, quantity } = req.body;
        const { id } = req.params;

        if (!spareName || !unitPrice) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required Fileds!"
            })
        }

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Please Fill in the Id of the SparePart"
            })
        }

        const q = "SELECT * FROM spareparts WHERE SparePartId = ?";
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
                    message: "Invalid ID! Spare Part Not Found!"
                })
            }

            if (result.length !== 0) {
                const q = "UPDATE spareparts SET SparePartName = ?, Category = ?, UnitPrice = ?, Quantity = ? WHERE SparePartId = ? ";
                db.query(q, [spareName, category, unitPrice, quantity, id], (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            success: false,
                            Error: err
                        })
                    }

                    res.status(202).json({
                        success: true,
                        message: "Spare Part Updated Successfully!"
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

export const deleteSpare = (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Please Fill in the Spare Part Id!"
            })
        }

        const q = "SELECT * FROM spareparts WHERE SparePartId = ?";
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
                    message: "Invalid ID! Please insert a valid Spare Part ID"
                })
            }

            if (result.length !== 0) {
                const q = "DELETE FROM spareparts WHERE SparePartId = ?";
                db.query(q, [id], (err, result) => {
                    if (err) {
                        return res.status(400).json({
                            success: false,
                            Error: err
                        })
                    }

                    res.status(200).json({
                        success: true,
                        message: "SPare Part Deleted Successfully!"
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