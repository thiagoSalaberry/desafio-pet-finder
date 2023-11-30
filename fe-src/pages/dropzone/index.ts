import {Router} from "@vaadin/router";
import {Dropzone} from "dropzone";
import { state } from "../../state";
import { cloudinary } from "../../../be-src/lib/cloudinary";
class DropzonePage extends HTMLElement {
    petName:string = "Nombre de la mascota";
    lastSeen:string = "Visto por últ. vez";
    imgURL:string = "";
    connectedCallback() {
        state.subscribe(()=>{
            this.render();
        })
        this.render();
    };
    render() {
        const currentState = state.getState();
        this.innerHTML = `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
            <script src="https://unpkg.com/dropzone@5/dist/min/dropzone.min.js"></script>
            <custom-header></custom-header>
            <custom-card></custom-card>
            <section class="dropzone-section">
                <div class="card-drop">
                    <div class="pet-picture"><i class="bi bi-file-image dz-message"></i></div>
                    <img src="" class="pet-photo" alt=""/>
                    <div class="info">
                        <h1 class="pet-name">${currentState.pet ? currentState.pet.petName : this.petName}</h1>
                        <p class="last-seen">${currentState.pet ? currentState.pet.lastSeen : this.lastSeen}</p>
                        <button class="edit-button">Editar</button>
                    </div>
                </div>
            </section>
            <form id="pet-data" class="form-data">
                <custom-text type="p" variant="label" color="white">Foto de la mascota</custom-text>
                <div class="drop-here dropzone"><i class="bi bi-file-image dz-message icono"></i></div>
                <div class="input-container">
                    <custom-text type="p" variant="label" color="white">Nombre de la mascota</custom-text>
                    <input type="text" id="pet-name" class="input black">
                </div>
                <div class="input-container">
                    <custom-text type="p" variant="label" color="white">¿Dónde lo viste?</custom-text>
                    <input type="text" id="last-seen" class="input black">
                </div>
                <custom-button class="submit-form">Cargar</custom-button>
            </form>
        `;
        const style = document.createElement("style");
        style.innerHTML = `
            body {
                background-color: aliceblue
            }
            .dropzone-section {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 100px;
            }
            .card-drop {
                width: 80%;
                min-height: 25vh;
                padding: 20px;
                background-color: grey;
                border-radius: 10px;
                display:flex;
                flex-direction: column;
                gap: 20px;
            }
            .pet-picture {
                min-height: 250px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                background-color: #f2f3f5;
                color: #959595;
                border-radius: 10px;
            }
            .pet-photo {
                width: 300px;
                height: auto;
            }
            .drop-here {
                min-height: 250px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                background-color: #f2f3f5;
                color: #959595;
                border-radius: 10px;
            }
            .bi {
                font-size: 50px;
            }
            .info {
                display:grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 1fr 1fr;
                font-size: 20px;
            }
            .edit-button {
                grid-column: 2;
                grid-row: 1/3;
                padding: 20px 60px;
                font-size: 20px;
                justify-self: right;
                align-self: center;
            }
            .form-data {
                padding: 20px;
                background-color: rgba(38, 48, 46, 1);
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .input-container {
                text-align: left;
            }
            .input {
                width: 100%;
                height: 60px;
                border: none;
                box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
                border-radius: 4px;
                margin: 0;
                padding: 10px;
                font-size: 20px;
                font-weight: 600;
            }
            .black {
                background-color: rgba(74, 85, 83, 1);
                color: white;
                cursor: white;
                caret-size: 10px;
            }
        `;
        this.appendChild(style);
        let imageDataUrl;
        const myDropzone = new Dropzone(".drop-here", {
            url: "/prueba",
            autoProcessQueue: false,
            thumbnailWidth: 200,
            thumbnailHeight: 200,
        });
        myDropzone.on("thumbnail", (file) => {
            // usando este evento pueden acceder al dataURL directamente
            imageDataUrl = file.dataURL
            console.log(file.dataURL)
            this.querySelector(".icono").remove();
            this.querySelector(".dz-details").remove();
            this.querySelector(".dz-progress").remove();
            this.querySelector(".dz-error-message").remove();
            this.querySelector(".dz-success-mark").remove();
            this.querySelector(".dz-error-mark").remove();

          });
        const formBtnEl = this.querySelector(".submit-form");
        formBtnEl.addEventListener("click", async (e)=>{
            e.preventDefault();
            const petNameEl:HTMLInputElement = this.querySelector("#pet-name");
            const lastSeenEl:HTMLInputElement = this.querySelector("#last-seen");
            const pet = {
                petName: petNameEl.value,
                lastSeen: lastSeenEl.value,
                img:imageDataUrl
            };
            state.setState({pet});
            const imageSrc = await state.setPetData(petNameEl.value, lastSeenEl.value, imageDataUrl);
            const petPhotoEl:HTMLImageElement = this.querySelector(".pet-photo");
            if(imageSrc) {
                petPhotoEl.src = imageSrc;
            };
        });
    };
};

customElements.define("dropzone-page", DropzonePage);