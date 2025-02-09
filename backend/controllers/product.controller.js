import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/radis.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req,res) =>{
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.log(`Error in occured when getAllProducts ==> ${error}`);
        res.status(500).json({message:'Something went wrong',error:error.message});
    }
};


export const getFeaturedProducts = async (req,res) =>{
    try {
        let featuredProducts = await redis.get("featured_products")
        if(featuredProducts){
            return res.status(200).json(JSON.parse(featuredProducts));
        }

        featuredProducts = await Product.find({isFeatured:true}).lean();

        if(!featuredProducts){
            return res.status(404).json({message:"Featured products not found"});
        }

        await redis.set("featured_products",JSON.stringify(featuredProducts));

        res.status(200).json(featuredProducts);
    } catch (error) {
        console.log(`Error in occured when getFeaturedProducts ==> ${error}`);
        res.status(500).json({message:'Something went wrong',error:error.message});
    }
}

export const createProduct = async(req,res) =>{
    try {
        const { name, description, price, image, category } = req.body
        let cloudinaryResponse = null
        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image,{folder:'products'})
        }

        await Product.create({
            name, 
            description, 
            price, 
            image:cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : '', 
            category
        })

        res.status(201).json(product)
    } catch (error) {
        console.log(`Error in occured when createProduct ==> ${error}`);
        res.status(500).json({message:'Something went wrong',error:error.message});
    }
}

export const deleteProduct = async (req,res) =>{
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }

        if(product.image){
            const publicId = product.image.split('/').pop().split('.')[0];
            try {
                await cloudinary.uploader.destroy(`products/${product.image}`);
                console.log(`Product image ${publicId} deleted from cloudinary`);
            } catch (error) {
                console.log(`Error in occured when deleteing the image ==> ${error}`);
            }
        }
        await Product.findByIdAndDelete(id);
        res.status(200).json({message:"Product deleted"});
    } catch (error) {
        console.log(`Error in occured when deleteProduct ==> ${error}`);
        res.status(500).json({message:'Something went wrong',error:error.message});
    }
}


export const getRecomendationProduct = async (req,res) =>{
    try {
        const products = await Product.aggregate([
            {$sample:{size:3}},
            {$project:{
                _id:1,
                name:1,
                price:1,
                image:1,
                description:1
            }
        }
        ])

        res.status(200).json(products);
    } catch (error) {
        console.log(`Error in occured when getRecomendationProduct ==> ${error}`);
        res.status(500).json({message:'Something went wrong',error:error.message});
    }
}

export const getProductsByCategory = async (req,res) =>{
    try {
        const category = req.params.category;
        const products = await Product.find({category});
        res.status(200).json(products);
    } catch (error) {
        console.log(`Error in occured when getProductsByCategory ==> ${error}`);
        res.status(500).json({message:'Something went wrong',error:error.message});
    }
};



export const toogleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("error in update cache function");
	}
}