class MsConfigButton extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({
            mode: 'open'
        });
        const styles = document.createElement('style');
        this.button = document.createElement('A');
        this.button.classList.add('snowman');
        this.button.innerHTML = `<div></div><div></div><div></div>`;
        styles.textContent = `
        .snowman {
            display: flex;
            flex-direction:column;
            align-items: center;
            cursor:pointer; 
            width: 1.5rem;
            padding: 5px;  
            } 
        .snowman div {
            width:4px;
            height:4px;
            border-radius:50%;
            background-color:var(--ig-green);
            transition: all 0.5s ease;
        }
	    .snowman div:not(:last-child) { 
            margin-bottom:0.25rem 
        }
        .snowman.active div{
            width:1.75rem;
            height:0.25rem;
            transition: all 0.5s ease;
        }
        .snowman.active div:nth-child(1){
           transform:translate(0, 0.5rem) rotate(45deg);
        }
        .snowman.active div:nth-child(2){
            opacity:0;
        }
        .snowman.active  div:nth-child(3){
            transform: translate(0, -0.5rem) rotate(-45deg);
	    }`;
        this.toggle = this.toggle.bind(this);
        this.close = this.close.bind(this);

        this.addEventListener('click', this.toggle, false);
        shadow.appendChild(styles);
        shadow.appendChild(this.button);
    }
    toggle(e) {
        if (this.active) {
            this.classList.remove('active');
            this.button.classList.remove('active');
            document.getElementById(this.target).classList.remove('active');
            document.body.removeEventListener('click', this.close);
        } else {
            this.classList.add('active');
            this.button.classList.add('active');
            document.getElementById(this.target).classList.add('active');
            e.stopImmediatePropagation();
            document.body.addEventListener('click', this.close);

        }

    }
    close(e) {
        if (e.path.some((element) => {
            return element.nodeName == "MS-CONFIG" || element.id == this.target
        })) {
            return
        } else {
            this.classList.remove('active');
            this.button.classList.remove('active');
            document.getElementById(this.target).classList.remove('active');
            document.body.removeEventListener('click', this.close);
        }

    }
    get target() {
        return this.getAttribute('target');
    }
    get active() {
        return this.classList.contains("active");
    }

}