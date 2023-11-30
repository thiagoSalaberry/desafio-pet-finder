import {Router} from "@vaadin/router";
import { state } from "../../state";
class EliminadoPage extends HTMLElement {
    connectedCallback() {
        this.render();        
    };
    async render() {
        const currentState = state.getState();
        this.innerHTML = `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
            <section class="deleted">
                <div class="container">
                    <i class="bi bi-check-circle"></i>
                    <custom-text tag="p" variant="p">¡El reporte de Nombre fue eliminado!</custom-text>
                </div>
            </section>
        `;
        const style = document.createElement("style");
        style.innerHTML = `
            body {
                background-color: aliceblue
            }
            .deleted {
                width: 100vw;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .container{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 450px;
                height: 300px;
                background: white;
                padding: 30px;
                box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25); 
                border-radius: 20px
            }
            .bi {
                font-size: 75px;
                color: #68fc6a;
            }
            custom-text {
                text-align: center;
            }
        `
        this.appendChild(style);
    };
};


customElements.define("eliminado-page", EliminadoPage);