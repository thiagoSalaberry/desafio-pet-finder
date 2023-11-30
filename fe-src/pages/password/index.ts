import {Router} from "@vaadin/router";
import {state} from "../../state";
class PasswordPage extends HTMLElement {
    connectedCallback() {
        this.render();
    };
    async render() {
        if(await state.authenticate()) {
            this.innerHTML = `
            <custom-header></custom-header>
            <section class="password">
                <custom-text tag="h1" variant="title">Contraseña</custom-text>
                <form id="form">
                    <div class="input-container">
                        <label for="password"><custom-text tag="p" variant="label">CONTRASEÑA</custom-text></label>
                        <input type="password" id="password" class="input"/>
                    </div>
                    <div class="input-container">
                        <label for="confirm-password"><custom-text tag="p" variant="label">CONFIRMAR CONTRASEÑA</custom-text></label>
                        <input type="password" id="confirm-password" class="input"/>
                    </div>
                    <p class="error-message"></p>
                    <custom-button class="submit-button">Actualizar</custom-button>
                </form>
            </section>
            `;
            const style = document.createElement("style");
            style.innerHTML = `
                body {
                    background-color: aliceblue
                }
                .password {
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
                .submit-button {
                    margin-top: 190px;
                }
                .error-message {
                    font-size: 24px;
                    margin: 0;
                    color: red;
                }
            `
            this.appendChild(style);
            const inputEls = this.querySelectorAll("input");
            const submitButtonEl:HTMLButtonElement = this.querySelector(".submit-button");
            submitButtonEl.addEventListener("click", async ()=>{
                const errorMessage = this.querySelector(".error-message");
                if(inputEls[0].value.length < 8) {
                    errorMessage.textContent = "La contraseña debe tener al menos 8 caracteres.";
                } else if(inputEls[0].value != inputEls[1].value) {
                    errorMessage.textContent = "Las contraseñas no coinciden."
                } else {
                    if(await state.updatePassword(inputEls[0].value, inputEls[1].value)) {
                        window.location.reload();
                    };
                };
            });
        };
    }
};

customElements.define("password-page", PasswordPage);