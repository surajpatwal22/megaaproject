import mongoose from "mongoose";
import app from "./app.js";

( async ( ) => {
    try {
        await mongoose.connect("mongodb://localhost:27017/ecom")    
            app.on('error',(err)=>{
                console.error("ERROR: ",err);
                throw err

            })
            const onListening = () =>{
                console.log(`Listning on port 5000`);
            }
            app.listen(5000, onListening)
            // app.listen(5000,()=>{
            //     console.log(`Listning on port 5000`);
            // })
    } catch (err) {
        console.err("Error :",err)
        throw err
    }

})()
