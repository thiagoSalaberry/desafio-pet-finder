customElements.define(
    "custom-text",
    class extends HTMLElement {
        shadow = this.attachShadow({mode: "open"});
        constructor() {
            super();
            this.render();
        };
        render() {
            type Texto = "h1" | "h2" | "p" | "a" | "label";
            type Tipo = "title" | "subtitle" | "label" | "link" | "black";
            const tag = this.getAttribute("tag") as Texto;
            const variant = this.getAttribute("variant") as Tipo;
            const link = this.getAttribute("href");
            const color = this.getAttribute("color");
            const type = document.createElement(tag);
            const style = document.createElement("style");
            style.innerHTML = `
                * {
                    font-family: 'Poppins', sans-serif;
                }
                .title {
                    font-weight: 700;
                    font-size: 40px;
                    margin: 0;
                    line-height: 54px;
                }
                .subtitle {
                    font-weight: 500;
                    font-size: 30px;
                    margin: 0;
                    line-height: 36px;
                }
                .p, .black, .label {
                    font-size: 24px;
                    margin: 0;
                }
                .black {
                    font-weight: 600;
                }
                .label, .a {
                    font-size: 24px;
                }
                .a {
                    color: rgba(59, 151, 211, 1);
                }
                .error {
                    color: red;
                }
                .white {
                    color: white;
                }
            `;
            type.className = variant;
            type.classList.add(color);
            type.innerHTML = this.innerHTML;
            type.setAttribute("href", link);
            this.shadow.appendChild(type);
            this.shadow.appendChild(style);
        };
    }
);