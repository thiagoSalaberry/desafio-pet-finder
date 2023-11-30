import {Router} from "@vaadin/router";
import { state } from "../../state";
customElements.define(
    "custom-header",
    class extends HTMLElement {
        shadow = this.attachShadow({mode: "open"});
        constructor() {
            super();
            this.render();
        };
        render() {
            const currentState = state.getState();
            const email = currentState.user?.email;
            const imageURL = require(`url:./mapa.png`);
            const cruzURL = require(`url:./cruz.svg`);
            this.shadow.innerHTML = `
                <header class="header">
                    <img src="${imageURL}" alt="mapa" class="mapa">
                    <button class="hamburguer">
                        <div class="bar"></div>
                        <div class="bar"></div>
                        <div class="bar"></div>
                    </button>
                </header>
                <div class="menu off">
                    <img src="${cruzURL}" alt="cruz" class="cruz">
                    <ul class="lista">
                        <li class="list-item" id="menu"><custom-text tag="p" variant="black">Mis datos</custom-text></li>
                        <li class="list-item" id="my-reports"><custom-text tag="p" variant="black">Mis mascotas resportadas</custom-text></li>
                        <li class="list-item" id="report-pet"><custom-text tag="p" variant="black">Reportar mascotas</custom-text></li>
                    </ul>
                    <footer class="footer">
                    ${!localStorage.getItem("accessToken") ? `<custom-a href="/login" class="login">INICIAR SESIÓN</custom-a>` : `
                        <custom-text tag="p" variant="p">${email ? email : "emailDeEjemplo@gmail.com"}</custom-text>
                        <custom-a href="/home" class="close">CERRAR SESIÓN</custom-a>`}
                    </footer>
                </div>
            `;
            const style = document.createElement("style");
            style.innerHTML = `
                .header {
                    background-color: rgba(38, 48, 46, 1);
                    height: 70px;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-radius: 0 0 10px 10px;
                }
                .hamburguer{
                    margin: 0 20px 0 0;
                    width: 30px;
                    height: 30px;
                    border: none;
                    background: none;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    cursor: pointer;
                    padding: 0;
                }
                .mapa {
                    width: 40px;
                    margin: 0 0 0 20px;
                    height: 40px;
                }
                .bar {
                    width: 100%;
                    height: 4px;
                    background-color: #fff;
                    border-radius: 2px;
                }
                .menu {
                    position: absolute;
                    top: 0px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(38, 48, 46, 1); 
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    color: white;
                    z-index: 100;
                }
                .cruz {
                    align-self: end;
                    margin: 20px 20px 0 0;
                    width: 30px;
                    height: 30px;
                }
                .lista {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                    gap: 80px;
                }
                .list-item {
                    font-size: 1.7em;
                    text-decoration: none;
                    color: white;                    
                }
                .footer {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 50px;
                }
                .off {
                    display: none;
                }
            `;
            this.shadow.appendChild(style);
            const mapaEl:HTMLButtonElement = this.shadow.querySelector(".mapa");
            const hamburguerEl:HTMLButtonElement = this.shadow.querySelector(".hamburguer");
            const menuEl:HTMLElement = this.shadow.querySelector(".menu");
            const cruzEl:HTMLButtonElement = this.shadow.querySelector(".cruz");
            const listaEl = this.shadow.querySelector(".lista");
            const closeEl = this.shadow.querySelector(".close");
            const loginEl = this.shadow.querySelector(".login");
            listaEl.addEventListener("click", (e:any)=>{
                if(!localStorage.getItem("accessToken")) {
                    Router.go(`/login`)
                    menuEl.classList.add("off");
                } else {
                    Router.go(`/${e.target.parentNode.id}`)
                    menuEl.classList.add("off");
                }
            });
            mapaEl.addEventListener("click", ()=>{
                Router.go("/home")
            });
            hamburguerEl.addEventListener("click", ()=>{
                menuEl.classList.remove("off");
            });
            cruzEl.addEventListener("click", () => {
                menuEl.classList.add("off");
            });
            closeEl?.addEventListener("click", ()=>{
                localStorage.removeItem("accessToken");
                if(location.pathname == "/home") {
                    window.location.reload();
                } else {
                    Router.go("/home");
                }
            });
            loginEl?.addEventListener("click", ()=>{
                if(location.pathname = "/login") {
                    menuEl.classList.add("off");
                } else {
                    Router.go("/login");
                }
            });
        };
    }
);