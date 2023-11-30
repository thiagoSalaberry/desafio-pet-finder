customElements.define(
    "custom-info-item",
    class extends HTMLElement {
        shadow = this.attachShadow({mode: "open"});
        constructor() {
            super();
            this.render();
        };
        render() {
            const text = this.getAttribute("text");
            this.shadow.innerHTML = `
                <div class="info">
                    <custom-text tag="p" variant="p">${text}</custom-text>
                </div>
            `;
            const style = document.createElement("style");
            style.innerHTML = `
                .info {
                    width: 100%;
                    border: none;
                    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
                    border-radius: 4px;
                    margin: 0;
                    padding: 10px;
                    font-size: 20px;
                    font-weight: 500;
                    text-align: left;
                    background-color: white;
                }
            `;
            this.shadow.appendChild(style);
        };
    }
);