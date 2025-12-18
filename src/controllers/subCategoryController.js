import { SubCategory, Category } from "../models/index.js";

export const createSubCategory = async (req, res) => {
    try {
        const { name, categoryId } = req.body;
        if (!name || !categoryId) {
            return res.status(400).json({ message: "Name and Category ID are required" });
        }

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const subCategory = await SubCategory.create({ name, categoryId });
        res.status(201).json({ message: "SubCategory created successfully", subCategory });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.findAll({
            include: [{ model: Category, as: 'category' }]
        });
        res.status(200).json(subCategories);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, categoryId } = req.body;

        const subCategory = await SubCategory.findByPk(id);
        if (!subCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }

        if (categoryId) {
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        await subCategory.update({ name, categoryId });
        res.status(200).json({ message: "SubCategory updated successfully", subCategory });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const subCategory = await SubCategory.findByPk(id);

        if (!subCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }

        await subCategory.destroy();
        res.status(200).json({ message: "SubCategory deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
