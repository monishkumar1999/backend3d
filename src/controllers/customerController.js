import { Customer } from "../models/index.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/jwt.js";

export const signup = async (req, res) => {
    try {
        const { name, email, mobile_number, password } = req.body;

        if (!name || !email || !mobile_number || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required (name, email, mobile_number, password)",
            });
        }

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ where: { email } });
        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: "Customer with this email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newCustomer = await Customer.create({
            name,
            email,
            mobile_number,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "Customer registered successfully",
            data: {
                id: newCustomer.id,
                name: newCustomer.name,
                email: newCustomer.email,
            },
        });
    } catch (error) {
        console.error("Error in customer signup:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const customer = await Customer.findOne({ where: { email } });
        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = createToken({
            id: customer.id,
            name: customer.name,
            role: "customer",
        });

        // Save token in cookie as per adminController pattern
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.json({
            success: true,
            message: "Login successful",
            token,
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
            },
        });
    } catch (error) {
        console.error("Error in customer login:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
