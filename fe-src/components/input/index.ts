customElements.define(
    "custom-input",
    class extends HTMLElement {
        shadow = this.attachShadow({mode: "open"});
        constructor() {
            super();
        };
        connectedCallback() {
            this.render();
            const input:HTMLInputElement = this.shadow.querySelector(".input");
            const value = input.value;
        }
        render() {
            type Color = "white" | "black";
            type Type = "text" | "email" | "number" | "password";
            const color = this.getAttribute("color") as Color;
            const type = this.getAttribute("type") as Type;
            this.shadow.innerHTML = `
                <input type="${type}" class="input"/>
            `;
            const style = document.createElement("style");
            style.innerHTML = `
                .input {
                    width: 100%;
                    height: 60px;
                    border: none;
                    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
                    border-radius: 4px;
                    margin: 0;
                    padding: 0;
                    font-size: 20px;
                    font-weight: 600;
                }
                .black {
                    background-color: rgba(74, 85, 83, 1);
                    color: white;
                    cursor: white;
                    caret-size: 10px;
                }
            `;
            this.shadow.appendChild(style);
            this.shadow.querySelector(".input").classList.add(color);
        };
    }
);