import {Router} from "@vaadin/router";
import { state } from "../../state";
import {map} from "lodash";
class LostPetsPage extends HTMLElement {
    connectedCallback() {
        this.render();
        };
    async render() {
        const currentState = state.getState();
        const imageURL = require(`url:./my-reports.svg`);
        this.innerHTML = `
        <custom-header></custom-header>
        <section class="password">
            <custom-text tag="h1" variant="title">Mascotas perdidas cerca</custom-text>
            ${currentState.nearLostPets?.length > 0 ? `
                <div class="cards-container">
                ${map(currentState.nearLostPets, (pet) => `<custom-card id="${pet.objectID}" pet-name="${pet.pet_name}" where="${pet.last_seen}" action="report" imgSrc="${pet.img}"></custom-card>`).join("")}
                </div>
            ` : `
                <custom-text tag="p" variant="subtitle">Aún no reportaste mascotas perdidas.</custom-text>
                <img src="${imageURL}" class="img-svg"/>
            `}
        </section>
        `;
        const style = document.createElement("style");
        style.innerHTML = `
            body {
                background-color: aliceblue;
                height: 100vh;
            }
            .password {
                display: flex;
                flex-direction: column;
                justify-content: start;
                align-items: center;
                height: 100vh;
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
            .input-container {
                text-align: left;
            }
            .submit-button {
                margin-top: 190px;
            }
            .cards-container {
                display: flex;
                flex-direction: column;
                gap: 100px;
            }
        `
        this.appendChild(style);
    };
};

customElements.define("lost-pets-page", LostPetsPage);