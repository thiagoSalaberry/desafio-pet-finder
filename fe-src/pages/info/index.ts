import {Router} from "@vaadin/router";
import { state } from "../../state";
class InfoPage extends HTMLElement {
    connectedCallback() {
        this.render();
    };
    render() {
        this.innerHTML = `
        <custom-header></custom-header>
        <section class="home">
            <custom-text tag="h1" variant="title">¿Cómo funciona Pet Finder?</custom-text>
            <custom-text tag="p" variant="subtitle">Tenés dos formas de usar Pet Finder:</custom-text>
            <div class="info-list">
                <custom-info-item text="Podés compartirnos tu ubicación actual y ver las mascotas que se perdieron por tu zona."></custom-info-item>
                <custom-info-item text="Podés reportar que perdiste a tu mascota en determinada zona y te avisaremos si alguien reporta que la encontró."></custom-info-item>
            </div>
            <div class="button-container">
                <custom-button id="lost-pets">Compartir mi ubicación actual</custom-button>
                <custom-button id="report-pet" color="red">Perdí a mi mascota</custom-button>
            </div>
        </section>
        `;
        const style = document.createElement("style");
        style.innerHTML = `
            body {
                background-color: aliceblue
            }
            .home {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 90vh;
                text-align: center;
                gap: 40px;
                padding: 50px;
            }
            .info-list {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 30px;
            }
            .button-container {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 25px;
            }
        `
        this.appendChild(style);
        const lostPetsBtn:HTMLButtonElement = this.querySelector("#lost-pets");
        const lostMyPetBtn:HTMLButtonElement = this.querySelector("#report-pet");
        lostPetsBtn.addEventListener("click", async()=>{
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const {latitude, longitude} = position.coords;
                    await state.getNearPets({lat: latitude, lng: longitude});
                    Router.go("/lost-pets");
                });
            };
        });
        lostMyPetBtn.addEventListener("click", ()=>{
            Router.go("/report-pet");
        });
    };
};

customElements.define("info-page", InfoPage);