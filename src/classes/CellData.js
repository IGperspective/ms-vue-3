export default class CellData {
    _openState = false;
    _interactive = true;
    _marker = {
        flag: false,
        question: false
    }
    _value = 0;
    _quickReveal = false;
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.id = row + '_' + col;
    }
    toggleMarker() {
        if (this._marker.flag) {
            this._marker.question = true;
            this._marker.flag = false;
            return -1
        } else {
            this._marker.flag = true;
            this._marker.question = false
            return 1
        }
    }
    removeMarker() {
        let difference = 0;
        if (this._marker.flag) {
            difference = -1;
        }
        this._marker.flag = this._marker.question = false
        return difference
    }
    get isOpen() {
        return this._openState
    }
    set isOpen(val) {
        if (val) {
            this._openState = true
        } else {
            this._openState = false
        }
    }
    get value() {
        return this._value
    }
    set value(val) {
        this._value = val

    }
    get isMarked() {
        return this._marker.flag || this._marker.question
    }
    get marker() {
        return this._marker
    }
    get isInteractive() {
        return this._interactive
    }
    set isInteractive(val) {
        this._interactive = val
    }
    get quickReveal() {
        return this._quickReveal
    }
    set quickReveal(val) {
        this._quickReveal = val
    }
    changeState() {
        console.log(this)
        if (this.isOpen) {
            return;
        } else if (!this.isMarked) {
            this.isOpen = true;
            //  emitUpdateOpen();
        } else {
            this.removeMarker();
        }
    }

    reset() {
        this._openState = false;
        this._interactive = true;
        this._marker = {
            flag: false,
            question: false
        };
        this._value = 0;
        this._quickReveal = false;

    }
    lightReset() {
        this._openState = false;
        this._interactive = true;
        this._value = 0;
        this._quickReveal = false;

    }
}