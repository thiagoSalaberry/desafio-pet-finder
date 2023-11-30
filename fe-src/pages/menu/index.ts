import {Router} from "@vaadin/router";
import { state } from "../../state";
class MenuPage extends HTMLElement {
    connectedCallback() {
        this.render();
    };
    async render() {
        await state.authenticate();
        const currentState = state.getState();
        const email = currentState.user?.email;
        this.innerHTML = `
        <custom-header></custom-header>
        <section class="my-data">
            <custom-text tag="h1" variant="title">Mis Datos</custom-text>
            <div class="button-container">
                <custom-button id="my-data">Modificar datos personales</custom-button>
                <custom-button id="password">Modificar contraseña</custom-button>
            </div>
            <div class="button-container">
                <custom-text tag="p" variant="p">${email ? email : "emailDeEjemplo@gmail.com"}</custom-text>
                <custom-a href="/home" class="close">CERRAR SESIÓN</custom-a>
            </div>
        </section>
        `;
        const style = document.createElement("style");
        style.innerHTML = `
            body {
                background-color: aliceblue
            }
            .my-data {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                height: 90vh;
                text-align: center;
                gap: 100px;
                padding: 50px;
            }
            .button-container {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 25px;
            }
        `
        this.appendChild(style);
        const doBtnEls = this.querySelectorAll("custom-button");
        doBtnEls.forEach((button:HTMLButtonElement) => {
            button.addEventListener("click", (e:any)=>{
                Router.go(`/${e.target.getAttribute("id")}`);
            });
        })
        const closeEl = this.querySelector(".close");
        closeEl?.addEventListener("click", ()=>{
            localStorage.removeItem("accessToken");
            Router.go("/home");
        });
    };
};

customElements.define("menu-page", MenuPage);