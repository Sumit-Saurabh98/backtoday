const express = require('express');
const EmployeeModel = require("../models/employeeModel");
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const employee = await EmployeeModel.find()
        res.status(200).json({employee, msg:"these are the employees"})
    } catch (error) {
        console.log("fetch employee error", error)
        res.status(500).json({message:"Internal Server Error during getting"})
    }
})

router.post('/create', async(req, res)=>{
    try {
        const{firstName, lastName, email, department, salary} = req.body

        const newEmployee  = await EmployeeModel.create({
            firstName,
            lastName,
            email,
            department,
            salary
        })
        res.status(201).json({message:"employee added",employee: newEmployee})
    } catch (error) {
        console.log("employee addition error", error)
        res.status(500).json({message:"Internal server error during adding"})
    }
})

router.put("/update/:employeeId", async(req, res)=>{
    try {
        const {firstName, lastName, email, department, salary} = req.body
        const employeeId = req.params.employeeId

        const updatedEmployee = await EmployeeModel.findOneAndUpdate({_id:employeeId},{firstName, lastName, email, department,salary}, {new:true} );
        if(!updatedEmployee){
            return res.status(404).json({message:"employee not found"})
        }
        res.json({message:"Employee details updated", employee:updatedEmployee})
    } catch (error) {
        console.log("updated employee error", error)
        res.status(500).json({message:"Internal server error during update"})
    }
})

router.delete("/delete/:employeeId", async (req, res) => {
    try {
        const employeeId = req.params.employeeId

        const deletedEmployee = await EmployeeModel.findOneAndDelete({ _id: employeeId});
        if(!deletedEmployee){
            return res.status(404).json({message:" employee not deleted"})
        }
        res.json({message:"employee deleted successfully", employee:deletedEmployee})
    } catch (error) {
        console.log("deleted employee error", error)
        res.status(500).json({message:"Internal server error during delete"})
    }
})


module.exports = router
