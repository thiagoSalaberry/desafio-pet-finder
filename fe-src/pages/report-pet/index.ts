import {Router} from "@vaadin/router";
import {Dropzone} from "dropzone";
import { state } from "../../state";
import { setupMap/*, getLatLng */} from "../../../be-src/lib/mapbox";
class ReportPetPage extends HTMLElement {
    connectedCallback() {
        this.render();        
    };
    async render() {
        await state.authenticate();
        this.innerHTML = `
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <script src="https://unpkg.com/dropzone@5/dist/min/dropzone.min.js"></script>
        <script src='https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js'></script>
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css' rel='stylesheet' />
        <custom-header></custom-header>
        <section class="report-pet">
            <custom-text tag="h1" variant="title">Reportar mascota</custom-text>
            <custom-text tag="p" variant="subtitle">Ingresá la siguiente información para realizar el reporte de la mascota.</custom-text>
            <form id="report-pet-form">
                <div class="input-container">
                    <label for="name"><custom-text tag="p" variant="label">NOMBRE</custom-text></label>
                    <input type="text" id="name" class="input"/>
                </div>
                <div class="picture-container">
                    <div class="pre-picture" id="drop-here"><i class="bi bi-card-image"></i></div>
                    <div class="foto-container off">
                        <img class="pet-picture off" src=""/>
                    </div>
                </div>
                <p class="error-message off"></p>
                <custom-button class="add-pic-button" color="blue">Agregar foto</custom-button>
                <div class="mapbox-container">
                    <div id="map" class="mapbox"></div>
                    <custom-text tag="p" variant="p">Buscá un punto de referencia para reportar en donde perdiste a tu mascota. Por ejemplo, la ubicación donde la viste por última vez.</custom-text>
                    <div class="input-container">
                        <label for="where"><custom-text tag="p" variant="label">UBICACIÓN</custom-text></label>
                        <div class="geocoder" id="geocoder"></div>
                    </div>
                </div>
                <custom-button class="confirm-ubication" color="blue">Confirmar ubicación</custom-button>
                <div class="input-container">
                    <label for="last-seen"><custom-text tag="p" variant="label">AGREGA ALGÚN COMENTARIO</custom-text></label>
                    <textarea name="last-seen" class="textarea" id="message"></textarea>
                </div>
                <custom-button class="submit-button" color="green">Reportar mascota</custom-button>
                <custom-button class="cancel-button" color="grey">Cancelar</custom-button>
            </form>
        </section>
        `;
        const style = document.createElement("style");
        style.innerHTML = `
            body {
                background-color: aliceblue
            }
            .report-pet {
                display: flex;
                flex-direction: column;
                justify-content: start;
                align-items: center;
                height: 90vh;
                text-align: center;
                gap: 100px;
                padding: 50px;
            }
            section form {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 40px;
                margin-top: 80px;
            }
            .picture-container {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .pre-picture {
                min-height: 400px;
                width: 100%;
                max-width: 700px;
                background-color: #ddd;
                border-radius: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 90px;
                cursor: pointer;
                color: #777;
            }
            .dz-image {
                display: flex;
                justify-content: center;
                align-items: center;
                object-fit: cover;
                border-radius: 20px;
            }
            img {
                border-radius: 20px;
            }
            .foto-container {
                height: 400px;
                width: 700px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 20px;
                overflow: hidden;
                position: relative;
            }
            img .pet-picture {
                border-radius: 5px;
                width: 100%;
                height: 100%;
                max-height: 400px;
                object-fit: cover;
            }
            .input-container {
                text-align: left;
                width: 100%;
            }
            .input, .textarea {
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
            .error-message {
                font-size: 24px;
                margin: 0;
                color: red;
            }
            .mapbox-container {
                position: relative;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                flex-direction: column;
                gap: 40px;
            }
            .mapbox {
                height: 400px;
                width: 700px;
                border: solid #ddd 2px;
                border-radius: 30px;
            }
            .off {
                display: none;
            }
            .textarea {
                width: 100%;
                height: 260px;
                border: none;
                box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
                border-radius: 4px;
                padding: 10px;
                font-size: 20px;
                font-weight: 600;
                cursor: white;
                caret-size: 10px;
            }
        `
        this.appendChild(style);
        setupMap();
        const errorMessageEl:HTMLParagraphElement = this.querySelector(".error-message");
        const cancelBtnEl:HTMLButtonElement = this.querySelector(".cancel-button");
        cancelBtnEl.addEventListener("click", ()=>{
            window.history.back();
        });
        const imgEl:HTMLImageElement = this.querySelector(".pet-picture");
        let imageDataUrl:string;
        const prePictureEl:HTMLElement = this.querySelector(".pre-picture");
        prePictureEl.addEventListener("click", ()=>{
            prePictureEl.textContent = "";
        })
        const myDropzone = new Dropzone("#drop-here", {
            url: "/prueba",
            autoProcessQueue: false,
            thumbnailWidth: 220,
            thumbnailHeight: 220,
        });
        myDropzone.on("thumbnail", (file) => {
            // usando este evento pueden acceder al dataURL directamente
            imageDataUrl = file.dataURL
            this.querySelector(".dz-details").remove();
            this.querySelector(".dz-progress").remove();
            this.querySelector(".dz-error-message").remove();
            this.querySelector(".dz-success-mark").remove();
            this.querySelector(".dz-error-mark").remove();
            errorMessageEl.remove();
        });
        const addPicBtnEl:HTMLButtonElement = this.querySelector(".add-pic-button");
        addPicBtnEl.addEventListener("click", async()=>{
            if(imageDataUrl == undefined) {
                errorMessageEl.classList.remove("off")
                errorMessageEl.textContent = "Debes cargar una foto antes de poder subirla."
            } else {
                const imgSrc = await state.uploadPetPicture(imageDataUrl);
                this.querySelector(".foto-container").classList.remove("off");
                imgEl.classList.remove("off");
                this.querySelector("#drop-here").classList.add("off");
                imgEl.src = imgSrc;
                imageDataUrl = imgSrc;
            }
        });
        const submitBtnEl:HTMLButtonElement = this.querySelector(".submit-button");
        const cofnirmr:HTMLButtonElement = this.querySelector(".confirm-ubication");
        cofnirmr.addEventListener('click',async()=>{
            const last_seen = {
                last_seen: sessionStorage.getItem("last_seen"),
                coords: JSON.parse(sessionStorage.getItem("coords"))
            };
            state.setState({
                ...state.getState(),
                last_seen
            })
            // state.setLastSeen(sessionStorage.getItem("last_seen"), JSON.parse(sessionStorage.getItem("coords")).lat, JSON.parse(sessionStorage.getItem("coords")).lng);
        })
        submitBtnEl.addEventListener("click", async()=>{
            const currentState = state.getState();
            const nameInputEl:HTMLInputElement = this.querySelector("#name");
            const messageInputEl:HTMLTextAreaElement = this.querySelector("#message");
            const sendForm = await state.reportPet({owner_id: currentState.user.id, owner_name: currentState.user.first_name, owner_phone_number: currentState.user.phone_number, pet_name:nameInputEl.value, message: messageInputEl.value, last_seen_lat: currentState.last_seen.coords.lat, last_seen_lon: currentState.last_seen.coords.lng, last_seen: currentState.last_seen.last_seen, img: imageDataUrl})
            if(sendForm) {
                Router.go("/my-reports")
            }
        });
    };
};


customElements.define("report-pet-page", ReportPetPage);