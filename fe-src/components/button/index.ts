customElements.define(
    "custom-button",
    class extends HTMLElement {
        shadow = this.attachShadow({mode: "open"});
        constructor() {
            super();
            this.render();
        };
        render() {
            type Color = "blue" | "green" | "red" | "grey";
            const color = this.getAttribute("color") as Color;
            this.shadow.innerHTML = `
                <button class="button"></button>
            `;
            const style = document.createElement("style");
            style.innerHTML = `
                .button {
                    background: rgba(90, 143, 236, 1);
                    border: none;
                    border-radius: 4px;
                    color: #fff;
                    padding: 15px;
                    font-size: 20px;
                    width: 100%;
                    font-weight: 600;
                    font-family: 'Poppins', sans-serif;
                    cursor: pointer;
                }
                .button:active {
                    transform: translateY(2px) scale(.97);
                }
                .green {
                    background: rgba(0, 168, 132, 1);
                }
                .red {
                    background: rgba(235, 99, 114, 1);
                }
                .grey {
                    background: rgba(74, 85, 83, 1);
                }
            `;
            this.shadow.appendChild(style);
            const buttonEl = this.shadow.querySelector(".button") as HTMLButtonElement;
            buttonEl.innerHTML = this.innerHTML;
            buttonEl.classList.add(color)
        };
    }
);