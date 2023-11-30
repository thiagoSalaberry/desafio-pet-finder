import {Router} from "@vaadin/router";
import { state } from "../../state";
customElements.define(
    "custom-card",
    class extends HTMLElement {
        shadow = this.attachShadow({mode: "open"});
        constructor() {
            super();
            this.render();
        };
        render() {
            const currentState = state.getState();
            const cruzURL = require(`url:./cruz.svg`);
            const petName = this.getAttribute("pet-name");
            const where = this.getAttribute("where");
            const action = this.getAttribute("action");
            const imgSrc = this.getAttribute("imgSrc");
            const id = this.getAttribute("id");
            this.shadow.innerHTML = `
                <div id="${id}" class="card">
                    <div class="picture-container">
                        <img class="foto" src="${imgSrc}"/>
                    </div>
                    <div class="data">
                        <custom-text tag="h1" variant="title" class="pet">${petName}</custom-text>
                        <custom-text tag="p" variant="black" class="locacion">${where}</custom-text>
                        <custom-button class="button" color="${action == "report" ? "red" : "blue"}">${action == "report" ? "Reportar" : "Editar"}</custom-button>
                    </div>
                </div>
                <div class="menu off">
                    <img src="${cruzURL}" alt="cruz" class="cruz">
                    <custom-text tag="p" variant="title">Reportar info de ${petName}</custom-text>
                    <form id="pet-info">
                        <div class="input-container">
                            <label for="name"><custom-text tag="p" variant="label">NOMBRE</custom-text></label>
                            <input type="text" id="reporter-name" class="input black"/>
                        </div> 
                        <div class="input-container">
                            <label for="phone"><custom-text tag="p" variant="label">TELÉFONO</custom-text></label>
                            <input type="number" id="reporter-phone-number" class="input black"/>
                        </div> 
                        <div class="input-container">
                            <label for="last-seen"><custom-text tag="p" variant="label">¿DÓNDE LO VISTE?</custom-text></label>
                            <textarea name="last-seen" id="report-info" class="textarea black"></textarea>
                        </div> 
                        <custom-button id="submit-button" color="green">Enviar información</custom-button>
                    </form>                    
                </div>
                
            `;
            const style = document.createElement("style");
            style.innerHTML = `
                .card {
                    background-color: rgba(38, 48, 46, 1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    color: white;
                    border-radius: 10px;
                    padding: 10px;
                    gap: 10px;
                }
                .picture-container {
                    width: 420px;
                    height: 230px;
                    background-color: white;
                    border-radius: 5px;
                    overflow: hidden;
                    position: relative;
                }
                .foto {
                    border-radius: 5px;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .data {
                    display: grid;
                    width: 100%;
                    grid-template-columns: 1fr 100px
                    grid-template-rows: 1fr 1fr
                }
                .pet {
                    text-align: left;
                    grid-column: 1;
                    max-width: 300px;
                }
                .locacion {
                    text-align: left;
                    grid-column: 1;
                    max-width: 300px;
                }
                .button {
                    grid-column: 2;
                    grid-row: 1/3;
                    align-self: center;
                }
                .menu {
                    position: absolute;
                    top: 135px;
                    left: 30px;
                    right: 30px;
                    bottom: 135px;
                    background-color: rgba(38, 48, 46, 1); 
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    color: white;
                    border-radius: 10px;
                    padding: 20px;
                    z-index: 1000;
                }
                .cruz {
                    align-self: end;
                    width: 30px;
                    height: 30px;
                }
                #pet-info {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    z-index: 1000;
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
                    font-size: 22px;
                    font-weight: 600;
                    box-sizing: border-box;
                }
                .textarea {
                    box-sizing: border-box;
                    width: 100%;
                    height: 130px;
                    border: none;
                    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
                    border-radius: 4px;
                    margin: 0;
                    padding: 10px;
                    font-size: 22px;
                    font-weight: 600;background-color: rgba(74, 85, 83, 1);
                    color: white;
                    cursor: white;
                    caret-size: 10px;
                }
                .black {
                    background-color: rgba(74, 85, 83, 1);
                    color: white;
                    cursor: white;
                    caret-size: 10px;
                }
                .off {
                    display: none;
                }
            `;
            this.shadow.appendChild(style);
            const reportButtonEl:HTMLButtonElement = this.shadow.querySelector(".button");            
            const menuEl:HTMLElement = this.shadow.querySelector(".menu");
            const cruzEl:HTMLButtonElement = this.shadow.querySelector(".cruz");
            const sendInfo:HTMLButtonElement = this.shadow.querySelector("#submit-button");
            reportButtonEl.addEventListener("click", ()=>{
                if(reportButtonEl.textContent == "Editar") {
                    const report = currentState.myReports.find(report => report.id == id);
                    state.selectReportToEdit(report);
                    Router.go("/edit-report")
                } else if(reportButtonEl.textContent == "Reportar") {
                    menuEl.classList.remove("off");
                }
            })
                
            cruzEl.addEventListener("click", () => {
                menuEl.classList.add("off");
            });
            sendInfo.addEventListener("click", ()=>{
                const reporterName:HTMLInputElement = this.shadow.querySelector("#reporter-name");
                const reporterPhoneNumber:HTMLInputElement = this.shadow.querySelector("#reporter-phone-number");
                const reportInfo:HTMLInputElement = this.shadow.querySelector("#report-info");
                console.log({
                    reporterName: reporterName.value,
                    reporterPhoneNumber: reporterPhoneNumber.value,
                    reportInfo: reportInfo.value
                });
            });
        };
    }
);