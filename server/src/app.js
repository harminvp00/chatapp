
import 'dotenv/config';


export default function startApp(app){

    if(!app){
        throw new Error("App is not connected");
    }

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, ()=> {
        console.log(`App is running on http://localhost:${PORT}`)
    })
}