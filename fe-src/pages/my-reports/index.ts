import {Router} from "@vaadin/router";
import {Dropzone} from "dropzone";
import { state } from "../../state";
import {map} from "lodash";
class MyReportsPage extends HTMLElement {
    connectedCallback() {
        this.render();        
    };
    async render() {
        await state.authenticate();
        await state.getMyReports(state.getState().user.id);
        const currentState = state.getState();
        const imageURL = require(`url:./my-reports.svg`);
        this.innerHTML = `
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <custom-header></custom-header>
        <section class="my-reports">
        <custom-text tag="h1" variant="title">Mascotas reportadas</custom-text>
        ${currentState.myReports.length > 0 ? map(currentState.myReports, (pet) => `<custom-card id="${pet.id}" pet-name="${pet.pet_name}" where="${pet.last_seen}" action="edit" imgSrc="${pet.img}"></custom-card>`).join("") : `
            <custom-text tag="p" variant="subtitle">Aún no reportaste mascotas perdidas.</custom-text>
            <img src="${imageURL}" class="img-svg"/>
            `}
        <custom-button class="button" color="blue">Publicar reporte</custom-button>
        </section>
        `;
        const style = document.createElement("style");
        style.innerHTML = `
            body {
                background-color: aliceblue
            }
            .my-reports {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                height: 90vh;
                text-align: center;
                gap: 100px;
                padding: 50px;
            }
            .img-svg {
                width: 100%;
                max-width: 400px;
                height: auto;
            }
            .button {
                width: 100%;
            }
        `
        this.appendChild(style);
        const reportPetBtn:HTMLButtonElement = this.querySelector(".button");
        reportPetBtn.addEventListener("click", ()=>{
            Router.go("/report-pet")
        })
    };
};


customElements.define("my-reports-page", MyReportsPage);