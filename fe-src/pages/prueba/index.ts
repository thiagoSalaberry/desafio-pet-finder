import {Router} from "@vaadin/router";
class PruebaPage extends HTMLElement {
    connectedCallback() {
        this.render();
    };
    render() {
        this.innerHTML = `
            <div class="container">
                <custom-header></custom-header>
                <custom-card></custom-card>
                <custom-button>Texto</custom-button>
                <custom-button color="green">Texto</custom-button>
                <custom-button color="red">Texto</custom-button>
                <custom-button color="grey">Texto</custom-button>
                <custom-text tag="h1" variant="title">Ingresar</custom-text>
                <custom-text tag="h2" variant="subtitle">Un subtítulo de la página</custom-text>
                <custom-text tag="p" variant="p">Hola qué tal cómo va eso chavales</custom-text>
                <custom-text tag="p" variant="black">Ingresar</custom-text>
                <custom-text tag="p" variant="label">Nombre</custom-text>
                <custom-text tag="a" variant="a" href="https://www.twitter.com">Un link</custom-text>
                <div class="input-container">
                    <custom-text tag="label" variant="label">Nombre</custom-text>
                    <custom-input type="text"></custom-input>
                </div>
                <div class="input-container">
                    <custom-text tag="label" variant="label">Celular</custom-text>
                    <custom-input type="number" color="black"></custom-input>
                </div>
                <div class="input-container">
                    <custom-text tag="label" variant="label">Contraseña</custom-text>
                    <custom-input type="password" color="black"></custom-input>
                </div>
                <custom-info-item text="Item de prueba a ver qué onda"></custom-info-item>
            </div>
        `;
        const style = document.createElement("style")
        style.innerHTML = `
            .container {
                display: flex;
                flex-direction: column;
                gap: 15px;
                padding: 30px;
            }
            .input-container {
                padding: 0 30px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: start;
                width: 100%;
            }
        `
        const buttons = this.querySelectorAll("button");
        buttons.forEach(b => b.addEventListener("click", (e:any)=>{
            Router.go(`/${e.target.id}`);
        }));
        this.appendChild(style)
    };
};

customElements.define("prueba-page", PruebaPage);