export default class DataLoader {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async loadData() {
        const response = await fetch(this.filePath);
        const data = await response.json();
        return data;
    }
}
