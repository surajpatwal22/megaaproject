import { Collection } from "mongoose";
import collection from "../models/collection_schema.js"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/CustomError.js"

/**********************************************************
 * @CREATE_COLLECTION
 * @route https://localhost:5000/api/collection/
 * @description Controller used for creating a new collection
 * @description Only admin can create the collection
 *********************************************************/

export const createCollection = asyncHandler(async(req,res)=>{
    // Check whether user has already created this collection or not
    const {name} = req.user
    if (!name) {
        throw new CustomError("Collection name is required", 400);
    }
  const Collection = await collection.create({name});
  res.status(201).json({
    success:true,
    message:"collection created",
    Collection
  });


});

  /**
   * @UPDATE_COLLECTION
   * @route http://localhost:5000/api/collection/:collectionId
   * @description Controller for updating the collection details
   * @description Only admin can update the collection
   */

  export const updateCollection = asyncHandler( async(req,res)=>{
    const{name}= req.body
    const{id:collectionId} = req.params

    if (!name) {
        throw new CustomError("Collection name is required", 400);        
    }
    let updatedCollection = collection.findByIdAndUpdate(collectionId,{name},
        {
        new:true,
        runValidators:true,
    })

    if (!updatedCollection) {
        throw new CustomError("Collection not found", 404);
    }

    res.status(200).json({
        success:true,
        message:'Updated successfully',
        updateCollection
    });
  });

   /**
   * @DELETE_COLLECTION
   * @route http://localhost:5000/api/collection/:collectionId
   * @description Controller for deleting the collection
   * @description Only admin can delete the collection
   */

   export const deleteCollection = asyncHandler( async(req,res)=>{
    const{ id : collectionId }= req.params;
   const collectionToDelete = await collection.findById(collectionId);
   if (!collectionToDelete) {
    throw new CustomError("Collection not found", 404);
   }
   collectionToDelete.remove();

   res.status(200).json({
    success: true,
    message: "Collection has been deleted successfully",
   });
});

/**
   * @GET_ALL_COLLECTION
   * @route http://localhost:5000/api/collection/
   * @description Controller for getting all collection list
   * @description Only admin can get collection list
   * @returns Collection Object with available collection in DB
   */

export const getAllCollections = asyncHandler(async(req,res)=>{
    const collections =await collection.find({})
    if (!collections) {
        throw new CustomError("No collection found", 404);
    }
    res.status(200).json({
        success: true,
        collections,
      });

})