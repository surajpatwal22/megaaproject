import Product from "../models/product.schema.js"
import formidable from "formidable"
import { s3FileUpload, s3deleteFile} from "../service/imageUpload.js"
import Mongoose from "mongoose"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/CustomError.js"
import config from "../config/index.js"
import fs from "fs"


/**********************************************************
 * @ADD_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @descriptio Uses AWS S3 Bucket for image upload
 * @returns Product Object
 *********************************************************/

export const addProduct = asyncHandler(async(req,res)=>{
    
    const form = formidable({multiples: true,keepExtensions: true});
    form.parse(req,async function (err,fields,files) {
        if (!err) {
            throw new CustomError( err.message||"something went wrong"||404)
        }
        let productId =  new Mongoose.Types.ObjectId().toHexString()
        console.log(fields,files);
        if (!fields.name|| !fields.price|| !fields.description|| !fields.collection_id) {
            throw new CustomError("please fill all the fields",400)
        }
       let imgArrayResp = Promise.all(
            Object.key(files).map(async (file,index)=>{
                const element = file[filekey]
                console.log(element);
               let data = fs.readFileSync(element.filepath)
             const upload =  await s3FileUpload({
                bucketName: config.S3_BUCKET_NAME,
                key: `product/${productId}/photo_${index +1}.png`,
                body: data,
                ContentType: element.mimetype
               })
               console.log(upload);
               return {
                secure_url: upload.Location
               }
            })
        )
        let imgArray = await imgArrayResp
      const product =  Product.create({
            _id: productId,
            photos: imgArray,
            ...fields
        })
        if (!product) {
            throw new CustomError("product failed to be created in db",400)
        }
        res.status(200).json({
            success: true,
            product
        })
    })
})

//getaallproduct

export const getAllProduct =asyncHandler( async(req,res)=>{
   const products = Product.find({})
   if (!products) {
    throw new CustomError("no prduct found",400)
   }
   res.ststus(200).json({
    success:true,
    products
   })
})

//findsingle product

export const getProductById = asyncHandler( async(req,res)=>{
   const{id:productId} =  req.params
  const product =  Product.findById(productId)
  if (!product) {
    throw new CustomError("no product found",400)
  }
  res.status(200).json({
    success:true,
    product
  })
})

// by collection id 

export const getProductbyCollectionId = asyncHandler( async(req,res)=>{
   const{id: collectionId} = req.params
  const products = await Product.findById(collectionId)
  if (!products) {
    throw new CustomError("no product found",400)
  }
  res.status(200).json({
    success:true,
    products
  })
})

//delete products

export const deleteProduct = asyncHandler( async(req,res)=>{
    const {id: productId} =req.params
   const product = await Product.findById(productId)
   if (!product) {
    throw new CustomError("No product found", 404)

}
       //resolve promise
    // loop through photos array => delete each photo
    //key : product._id
   const deletePhotos = Promise.all(
    product.photos.map(async( elem, index) => {
        await s3deleteFile({
            bucketName: config.S3_BUCKET_NAME,
            key: `products/${product._id.toString()}/photo_${index + 1}.png`
        })
    })
   

   )
   await deletePhotos;
   await product.remove()

   res.status(200).json({
    success:true,
    message:"product has been deleted"
   })
    
})