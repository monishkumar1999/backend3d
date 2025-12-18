import { Category } from "../../models/index.js";

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const exists = await Category.findOne({ where: { name } });
       
        if (exists) {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        const newCategory = await Category.create({ name });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: newCategory
        });

    } catch (error) {
        console.error("Create Category Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const editCategory= async (req,res)=>{

if(!req.body){
    return res.status(500).json({
        status:"Error",
        message:"The body Is not provided"
    })
}
const {id,name,isdelete}=req.body;

if(!id){
    return res.status(500).json({
        status:"error",
        message:"id is must to the update "
    })
}

if(!name){
    return res.status(500).json({
        status:"error",
        message:"id is must to the update "
    })
}

let category=await Category.findOne({id:id});
category.name=name;

if(isdelete){
   category.action='1';
}
await category.save();

return res.status(200).json({
    status:"success",
    message:"category updated successfully",
    data:category   
});
}

export const viewCategory=async (req,res)=>{

  const category= await Category.findAll({
        where:{
            action:'0'
        }
    })

    return res.json({
        category
    })
}
