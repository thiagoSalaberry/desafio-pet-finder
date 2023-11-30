import * as express from "express";
import { Request, Response } from 'express';
import * as cors from "cors";
import { UserController } from "../controllers/users-controller";
import { AuthController } from "../controllers/auth-controller";
import { ReportController, ReportType } from "../controllers/reports-controller";
import { SeenController, SeenType } from "../controllers/seen-controller";
import { Middlewares } from "../middlewares";
import { sequelize } from "../models/connection";
import { petIndex } from "../lib/algolia";
import { Auth, Report, User } from "../models";
import * as path from "path";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT/* || 9999;*/;

app.use(express.json({
    limit: "50mb"
}));
app.use(cors());
app.use(express.static(path.join(__dirname, "../../dist")));

// (async()=>{
//     await sequelize.sync({force: true});
// })();
/////////////////////////////////////////////////////USERS//////////////////////////////////////////////////////////////////
//SIGNUP - AUTHENTICATION
app.post("/auth", async (req:Request, res:Response)=>{
    try{
        const userData:{email:string, password:string} = req.body;
        if(!userData.email || !userData.password) return res.status(400).send({message:"Se necesitan el usuario y la contraseña para registrar al usuario."});
        if(userData.password.length < 8) return res.status(400).send({message:"La contraseña debe tener al menos 8 caracteres."});
        const newUser:User = await UserController.create(userData);
        if(!newUser){
            return res.status(409).json({message:"El usuario ya está registrado."});
        } else {
            const authData = {user_id: newUser.get("id") as number, email: newUser.get("email") as string, hashedPassword: newUser.get("password") as string};
            const newAuth:Auth = await AuthController.create(authData);
            if(!newAuth){
                return res.status(400).json({message:"Error al crear la autenticación del usuario"});
            } else {
                res.status(201).json({
                    newUser,
                    newAuth
                });
            };
        }
    } catch (e) {
        console.log("Error in post /auth");
        res.status(400).json({message: "El correo electrónico o la contraseña que estás ingresando son inválidos."})
    }
});
//LOGIN - CREAR TOKEN PARA INGRESAR POSTERIORMENTE
app.post("/auth/token", async (req:Request, res:Response) => {
    const userData:{email:string, password:string} = req.body;
    if(!userData.email || !userData.password) return res.status(400).send({message:"Debes ingresar tu correo electrónico y contraseña para iniciar sesión."});
    try{
        const auth = await AuthController.getAuthByEmailAndPassword(userData.email, userData.password);
        if (!auth) {
            res.status(403).json({message: 'El correo electónico o la contraseña que estás ingresando son incorrectos.'});
        } else {
            const user:User = await UserController.getUserById(auth.auth.get("user_id") as number);
            res.json({user, token: auth.token});
        }
    } catch (e) {
        console.log("Error in post /auth/token");
        res.status(404).json({message: "No existe usuario con ese correo electrónico."})
    }
});
//AUTENTICACIÓN
app.get("/me", Middlewares.verifyToken, async(req:any, res:Response)=>{
    try{
        const user = await UserController.getUserById(req._user.id);
        res.json(user);
    } catch (e) {
        console.log("Error in get /users");
    }
});
//CARGAR DATOS PERSONALES
app.post("/set-user-data", Middlewares.verifyToken, async(req:Request, res:Response)=>{
    try{
        const {user_id, first_name, last_name, phone_number, city} = req.body;
        const updatedUser:User = await UserController.setUserData(user_id, first_name, last_name, phone_number, city);
        res.status(200).json({updatedUser});
    } catch (e) {
        console.log("Error in post /set-user-data");
    }
});
//OBTENER TODOS LOS USUARIOS
app.get("/users", async(req:Request, res:Response)=>{
    try{
        const allUsers:User[] = await UserController.getAllUsers();
        res.status(200).json({allUsers});
    } catch (e) {
        console.log("Error in get /users");
    }
});
//CAMBIAR CONTRASEÑA
app.post("/password", Middlewares.verifyToken, async(req:any, res:Response)=>{
    try{
        const {password, confirmPassword} = req.body;
        if(!password) return res.status(400).send({message:"Debes ingresar una contraseña válida para poder cambiarla."});
        if(password.length < 8) return res.status(400).send({message:"La contraseña debe tener al menos 8 caracteres."});
        if(password !== confirmPassword) return res.status(400).send({message:"Las contraseñas no coinciden."});
        await UserController.updatePassword(req._user.id, password);
        const auth = await AuthController.updatePassword(req._user.id, password);
        res.status(200).json(auth);
    } catch (e) {
        console.log("Error in post /password");
    }
});
//OBTENER USUARIO POR ID
app.get("/users/:userId", async(req:Request, res:Response)=>{
    try{
        if(typeof req.params.userId != "number") return res.status(400).json({message: "El id debe ser un número mayor a 0"})
        const user:User = await UserController.getUserById(parseInt(req.params.userId));
        if(!user){
            return res.status(404).json({message: `El usuario con id: ${req.params.userId} no existe`})
        }else{
            res.status(200).json({user});
        };
    } catch (e) {
        console.log("Error in get /users/:userId");
    }
});
/////////////////////////////////////////////////////SUPPORTS//////////////////////////////////////////////////////////////////
//CARGAR IMAGEN EN CLOUDINARY
app.post("/upload-image",async (req:Request, res:Response) => {
    try{
        const {imageURL} = req.body;
        if(!imageURL) return res.status(400).send({message:"Se necesita la dataURL de la imagen."});
        const imgSrc:string = await ReportController.uploadImage(imageURL);
        if(!imgSrc){
            return res.status(400).json({message:"Error al subir la imagen a Cloudinary"});
        } else {
            res.status(201).json(imgSrc);
        };
    } catch (e) {
        console.log("Error in post /upload-image");
    }
});
/////////////////////////////////////////////////////REPORTS//////////////////////////////////////////////////////////////////
//CREAR REPORTE
app.post("/reports/create", async (req:Request, res:Response) => {
    try{
        const report:ReportType = req.body;
        if(Object.keys(report).length < 9) {
            return res.status(400).json({message:"Faltan campos en el reporte"});
        };
        const userExists = UserController.getUserById(report.owner_id);
        if (!userExists) {
            return res.status(400).json({message:"No existe un usuario con ese ID"});
        };
        const newReport:Report = await ReportController.create(report);
        if(!newReport){
            return res.status(400).json({message:"Error al crear el reporte"});
        } else {
            res.status(201).json({newReport});
        }
    } catch (e) {
        console.log("Error in post /reports/create");
    }
});
//OBTENER TODOS LOS REPORTES
app.get("/reports", async (req:Request, res:Response) => {
    try{
        const allReports:Report[] = await ReportController.getAllReports();
        res.status(200).json(allReports)
    } catch (e) {
        console.log("Error in post /reports");
    }
});
//ENCONTRAR MASCOTAS CERCA
app.get("/reports/find-near-pets", async (req:Request, res:Response) => {
    try{
        const {lat, lng} = req.query;
        const nearLostPets = await petIndex.search("", {
            aroundLatLng: `${lat}, ${lng}`,
            aroundRadius: 10000
        });
        if(nearLostPets.hits.length == 0) {
            res.status(404).json({message:"No hay mascotas cerca"});
        } else {
            res.status(200).json(nearLostPets.hits);
        }
    } catch (e) {
        console.log("Error in post /reports/find-near-pets");
    }
});
//ENCONTRÉ UNA MASCOTA
app.post("/reports/found-a-pet", async (req:Request, res:Response) => {
    try{
        const seenData:SeenType = req.body;
        if(Object.keys(seenData).length < 4) {
            return res.status(400).json({message:"Faltan campos en la vista de encontrado"});
        } else {
            const foundAPet = await SeenController.create(seenData);
            res.status(201).json({foundAPet})
        }
    } catch (e) {
        console.log("Error in post /reports/found-a-pet");
    }
});
//OBTENER MIS REPORTES
app.get("/reports/:userId", Middlewares.verifyToken, async (req:Request, res:Response) => {
    try{
        const {userId} = req.params;
        const myReports:Report[] = await ReportController.geyMyReports(parseInt(userId));
        res.status(200).json(myReports);
    } catch (e) {
        console.log("Error in post /reports/:userId");
    }
});
//EDITAR UN REPORTE
app.patch("/reports/edit-report", Middlewares.verifyToken, async (req:Request, res:Response) => {
    try{
        const reportToEditParams:ReportType = req.body;
        if(Object.keys(reportToEditParams).length < 10) {
            return res.status(400).json({message:"Faltan campos en el reporte"});
        };
        const editedReport:Report = await ReportController.editReport(reportToEditParams);
        res.json(editedReport);
    } catch (e) {
        console.log("Error in patch /reports/edit-report");
    }
});
//ELIMINAR UN REPORTE
app.delete("/reports/delete", async (req:Request, res:Response) => {
    try{
        const {reportId} = req.body;
        if(!reportId) res.status(400).json({message: "Debes ingresar el ID del reporte que quiere eliminar"});
        const deletedReport:Report = await ReportController.deleteReport(reportId);
        res.status(200).json({
            message: "El reporte fue eliminado",
            deletedReport
        });
    } catch (e) {
        console.log("Error in post /reports/delete");
    }
});
app.get("*", (req, res)=>{
    const file = path.resolve(__dirname, "../../dist/index.html");
    res.sendFile(file);    
});
app.listen(PORT, ()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
});
