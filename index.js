import mongoose from "mongoose";
import app from "./src/app.js";
import  config  from "./src/config/index.js";

( async ( ) => {
    try {
        await mongoose.connect(config.MONGODB_URL)    
        //to connect express with database    
        app.on('error',(err)=>{
                console.error("ERROR: ",err);
                throw err

            })
            const onListening = () =>{
                console.log(`Listning on port ${config.PORT}`);
            }
            app.listen(config.PORT, onListening)
            // app.listen(5000,()=>{
            //     console.log(`Listning on port 5000`);
            // })
    } catch (err) {
        console.err("Error :",err)
        throw err
    }

})()
