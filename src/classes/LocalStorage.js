export default class LocalStorage {
    constructor() {
        if (this.support) {
            //this._resetData();
            if (localStorage.data !== undefined) {
                this.data = this._loadData();
            } else {
                this.data = new Map();
            }
        } else {
            this.data = new Map();
        }
        window.addEventListener("beforeunload", () => { this._saveData() })
    }
    _saveData() {
        localStorage.data = JSON.stringify(Array.from(this.data.entries()));
    }
    _loadData() {
        return new Map(JSON.parse(localStorage.data));
    }
    _resetData() {
        localStorage.removeItem("data");
        this.data = new Map();
    }
    getRecordTime(key) {
        if (this.data.has(key)) {
            return this.data.get(key)
        } else {
            return 5999
        }
    }
    recordTime(key, time) {
        if (this.getRecordTime(key) > time) {
            this.data.set(key, time);
        } else {
            return
        }
    }
    get support() {
        if (typeof (Storage) !== "undefined") {
            return true
        } else {
            return false
        }
    }

}