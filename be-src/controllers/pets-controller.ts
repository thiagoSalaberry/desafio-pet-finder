import { Pet } from "../models";
import { cloudinary } from "../lib/cloudinary";

type PetCreation = {
    petName: string,
    lastSeen: string,
    imageURL: string
};

export class PetController {
    static async uploadImage(imageURL:string):Promise<string> {
        try {
            const petImage = await cloudinary.uploader.upload(imageURL, {
                resource_type: "image",
                discard_original_filename: true,
            });
            return petImage.secure_url;
        } catch (error) {
            console.error('Error in PetController.uploadImage()', error);
        };
    }
    static async create(petData:PetCreation):Promise<Pet | false> {
        try {
            console.log({imageURL: petData.imageURL})
            const petImage = await cloudinary.uploader.upload(petData.imageURL, {
                resource_type: "image",
                discard_original_filename: true,
            });
            const newPet = await Pet.create({name:petData.petName, last_seen: petData.lastSeen, img: petImage.secure_url});
            if(newPet) {
                return newPet
            } else {
                return false;
            };
        } catch (error) {
            console.error('Error in UserController.create()', error);
        };
    };
};