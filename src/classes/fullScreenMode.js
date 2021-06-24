export default class FullScreen extends HTMLElement {

    static get observedAttributes() {
        return ['on', 'disabled'];
    }

    constructor() {
        super();
        this._mode = false;
        //like props
        this._elem = document.getElementById(this.getAttribute("elem"));

        const shadow = this.attachShadow({
            mode: 'open'
        });
        const template = document.createElement('template');
        template.innerHTML = `
        <style>
          :host {
            cursor:pointer;
            display: block;
            width: 30px;
            height: 30px;
            padding: 4px;
          }
          :host([hidden]) {
            display: none;
          }
          :host([disabled]) {
            display: none;
          }
          :host svg{
            fill:#7ac943;
        }
          :host([on]) svg{
            fill:#cfdfe6;
          }
          :host([on]){
              padding:8px;
          }
         
        </style>

        <svg height="100%" version="1.1" viewBox="10 10 16 16" width="100%" class="color">
        <path d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"></path>
        <path d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"></path>
        <path d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"></path>
        <path d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"></path>
        </svg>

      `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.addEventListener('click', this._onclick);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this._onClick);
    }

    _onclick() {
        if (this.mode) {
            this.mode = false;
        } else {
            this.mode = true;
        }
    }

    set mode(value) {
        const isOn = Boolean(value);

        if (isOn) {
            if (!this.hasAttribute('on'))
                this.setAttribute('on', '');
        } else {
            this.removeAttribute('on');
        }
    }
    get mode() {
        return this._mode
    }

    attributeChangedCallback(name, oldValue, newValue) {

        if (name == "disabled") {
            return
        } else {
            this._mode = this.hasAttribute('on');

            if (this._mode) {
                FullScreen.enter(this._elem);
                screen.orientation.lock("portrait").catch((error) => {
                    console.log(error);
                });

            } else {
                screen.orientation.unlock();
                setTimeout(() => {
                    FullScreen.exit();
                }, 0);

            }
        }

    }
    static orientation() {
        return (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
    }
    static enter(elem) {
        // Go into full screen first

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }

    }
    static exit() {
        // Exit full screen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

}