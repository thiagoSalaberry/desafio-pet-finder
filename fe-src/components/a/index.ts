customElements.define(
    "custom-a",
    class extends HTMLElement {
        shadow = this.attachShadow({mode: "open"});
        constructor() {
            super();
            this.render();
        };
        render() {
            const href = this.getAttribute("href");
            this.shadow.innerHTML = `
                <a href="${href}" class="link"></a>
            `
            const style = document.createElement("style");
            style.innerHTML = `
                * {
                    font-family: 'Poppins', sans-serif;
                }
                .link {
                    font-size: 24px;
                    color: rgba(59, 151, 211, 1);
                }
            `;
            this.shadow.appendChild(style);
            const aEl = this.shadow.querySelector(".link");
            aEl.innerHTML = this.innerHTML;
        };
    }
);