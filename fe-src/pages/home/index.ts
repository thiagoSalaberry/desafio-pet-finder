import {Router} from "@vaadin/router";
import { state } from "../../state";
class InicioPage extends HTMLElement {
    connectedCallback() {
        this.render();
    };
    async render() {
        await state.authenticate();
        const imageURL = require(`url:./welcome.svg`);
        this.innerHTML = `
        <custom-header></custom-header>
        <section class="home">
            <img src="${imageURL}">
            <custom-text tag="h1" variant="title">Pet Finder App</custom-text>
            <custom-text tag="p" variant="subtitle">Encontrá y reportá mascotas perdidas cerca de tu ubicación</custom-text>
            <div class="button-container">
                <custom-button id="seek-lost-pets">Dar mi ubicación actual</custom-button>
                <custom-button color="green" id="info">¿Cómo funciona Pet Finder?</custom-button>
                ${!localStorage.getItem("accessToken") ? `<div class="hor">
                                                            <custom-button class="split" id="login">Iniciar sesión</custom-button>
                                                            <custom-button class="split" id="signup">Registrarme</custom-button>
                                                        </div>` : ""}
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
            img {
                margin-bottom: 50px;
            }
            .button-container {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 25px;
            }
            .hor {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 25px;
            }
            .split {
                width: 100%;
            }
        `
        this.appendChild(style);
        const seekLostPetsBtn:HTMLButtonElement = this.querySelector("#seek-lost-pets");
        seekLostPetsBtn.addEventListener("click", async ()=>{
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const {latitude, longitude} = position.coords;
                    await state.getNearPets({lat: latitude, lng: longitude});
                    Router.go("/lost-pets");
                });
            };
        });
        const infoBtn:HTMLButtonElement = this.querySelector("#info");
        infoBtn.addEventListener("click", ()=>{
            Router.go("/info")
        });
        const loginBtn:HTMLButtonElement = this.querySelector("#login");
        const signupBtn:HTMLButtonElement = this.querySelector("#signup");
        loginBtn?.addEventListener("click", ()=>{
            Router.go("/login")
        });
        signupBtn?.addEventListener("click", ()=>{
            Router.go("/signup")
        });
    };
};

customElements.define("inicio-page", InicioPage);