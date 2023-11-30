import { User } from "../models";
import * as crypto from "crypto";

function getSHA256fromSTRING(input:string) {
    return crypto.createHash("sha256").update(input).digest("hex");
};

type UserCreation = {
    email: string,
    password: string,
};

export class UserController {
    static async create(userData:UserCreation):Promise<User> {
        try {
            const {email, password} = userData;
            const [user, created] = await User.findOrCreate({
                where: {email},
                defaults: {
                    email,
                    password: getSHA256fromSTRING(password)
                }
            });
            if(!created) {
                throw new Error("El correo electrónico corresponde a un usuario existente.")
            } else {
                return user;
            };
        } catch (error) {
            console.error('Error in UserController.create()', error);
        };
    };
    static async setUserData(user_id:number, first_name:string, last_name:string, phone_number:string, city:string):Promise<User> {
        try {
            const user:User = await User.findByPk(user_id);
            if (!user) throw new Error();
            user.update({first_name, last_name, phone_number, city});
            return user;
        } catch (error) {
            console.error('Error in UserController.setUserData()', error);
        };
    };
    static async updatePassword(userId:number, newPassword:string):Promise<object> {
        try {
            const user:User = await User.findByPk(userId);
            if (!user) {
                return {message: "El usuario no existe"};
            } else {
                user.update({password:getSHA256fromSTRING(newPassword)});
                return {message: "La contraseña se actualizó con éxito"};
            };
        } catch (error) {
            console.error('Error in UserController.updatePassword()', error);
        };
    };
    static async getUserById(userId:number):Promise<User> {
        try {
            const user:User = await User.findByPk(userId);
            if(!user) {
                throw new Error("Usuario no encontrado");
            } else {
                return user;
            };
        } catch (error) {
            console.error('Error in UserController.getUserById()', error);
        };
    };
    static async getAllUsers():Promise<User[] | []> {
        try {
            const allUsers:User[] = await User.findAll();
            return allUsers;
        } catch (error) {
            console.error('Error in UserController.getAllUsers()', error);
        };
    };
};