import {Router} from "@vaadin/router";
import { state } from "../../state";
class MyDataPage extends HTMLElement {
    connectedCallback() {
        this.render();
    };
    async render() {
        await state.authenticate();
        const currentState = state.getState();
        this.innerHTML = `
        <custom-header></custom-header>
        <section class="my-data">
            <custom-text tag="h1" variant="title">Datos personales</custom-text>
            <form id="form">
                <div class="input-container">
                    <label for="first-name"><custom-text tag="p" variant="label">NOMBRE</custom-text></label>
                    <input type="text" id="first-name" class="input" placeholder="${currentState.user.first_name ? currentState.user.first_name : ""}"/>
                </div>
                <div class="input-container">
                    <label for="last-name"><custom-text tag="p" variant="label">APELLIDO</custom-text></label>
                    <input type="text" id="last-name" class="input" placeholder="${currentState.user.last_name ? currentState.user.last_name : ""}"/>
                </div>
                <div class="input-container">
                    <label for="phone-number"><custom-text tag="p" variant="label">CELULAR</custom-text></label>
                    <input type="text" id="phone-number" class="input" placeholder="${currentState.user.phone_number ? currentState.user.phone_number : ""}"/>
                </div>
                <div class="input-container">
                    <label for="city"><custom-text tag="p" variant="label">LOCALIDAD</custom-text></label>
                    <input type="text" id="city" class="input" placeholder="${currentState.user.city ? currentState.user.city : ""}"/>
                </div>
                <custom-button class="submit-button">Guardar</custom-button>
            </form>
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
            .input-container {
                text-align: left;
            }
            .submit-button {
                margin-top: 100px;
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
            .error-message {
                font-size: 24px;
                margin: 0;
                color: red;
            }
        `
        this.appendChild(style);
        const submitButtonEl:HTMLButtonElement = this.querySelector(".submit-button");
        submitButtonEl.addEventListener("click", async()=>{
            const inputEls = this.querySelectorAll("input");
            const promise = await state.setUserData(currentState.user.id, inputEls[0].value == "" ? currentState.user.first_name : inputEls[0].value, inputEls[1].value == "" ? currentState.user.last_name : inputEls[1].value, inputEls[2].value == "" ? currentState.user.phone_number : inputEls[2].value, inputEls[3].value == "" ? currentState.user.city : inputEls[3].value);
            if (promise) {
                Router.go("/menu");
            }
        })
    };
};

customElements.define("my-data-page", MyDataPage);