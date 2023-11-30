import {Router} from "@vaadin/router";
import { state } from "../../state";
class RegistrarsePage extends HTMLElement {
    connectedCallback() {
        this.render();
    };
    async render() {
        await state.authenticate();
        this.innerHTML = `
            <custom-header></custom-header>
            <section class="signup">
            <custom-text tag="h1" variant="title">Registrarse</custom-text>
            <custom-text tag="p" variant="subtitle">Ingresá los siguientes datos para registrarte</custom-text>
            <form id="form">
                <div class="input-container">
                    <label for="email"><custom-text tag="p" variant="label">EMAIL</custom-text></label>
                    <input type="email" id="email" class="input"/>
                </div>
                <div class="input-container">
                    <label for="password"><custom-text tag="p" variant="label">CONTRASEÑA</custom-text></label>
                    <input type="password" id="password" class="input"/>
                </div>
                <div class="input-container">
                    <label for="confirm-password"><custom-text tag="p" variant="label">CONFIRMAR CONTRASEÑA</custom-text></label>
                    <input type="password" id="confirm-password" class="input"/>
                </div>
                <p class="error-message"></p>
                <custom-text tag="p" variant="p">¿Ya estás registrado? <custom-a href="/login">Inicia sesión</custom-a></custom-text>
                <custom-button class="submit-button">Siguiente</custom-button>
            </form>
            </section>
        `;
        const style = document.createElement("style");
        style.innerHTML = `
            body {
                background-color: aliceblue
            }
            .signup {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: start;
                height: 90vh;
                padding: 0 20px;
                margin-top: 110px;
                text-align: center;
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
        const formEl:HTMLFormElement = this.querySelector("#form");
        const submitButtonEl:HTMLButtonElement = this.querySelector(".submit-button");
        submitButtonEl.addEventListener("click", async (e)=>{
            e.preventDefault();
            const emailEl:HTMLInputElement = document.querySelector("#email");
            const passwordEl:HTMLInputElement = document.querySelector("#password");
            const confirmPasswordEl:HTMLInputElement = document.querySelector("#confirm-password");
            const errorMessage = this.querySelector(".error-message");
            if(!emailEl.value || !passwordEl.value || !confirmPasswordEl.value) {
                errorMessage.textContent = "Debes completar todos los campos para poder registrarte.";
            }
            if(passwordEl.value != confirmPasswordEl.value) {
                errorMessage.textContent = "Las contraseñas no coinciden.";
            } else {
                const promise = await state.signUp(emailEl.value, passwordEl.value);
                if(promise) {
                    const generateToken = await state.login(emailEl.value, passwordEl.value);
                    if(generateToken) {
                        Router.go("/home");
                    }
                }
            }
        });
    };
};

customElements.define("registrarse-page", RegistrarsePage);