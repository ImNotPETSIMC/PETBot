export class Embed {
    title: string;
    description: string;
    color: number;
    thumbnail?: { url: string };
    
    constructor(title: string, description: string, color:string, url?: string) {
        this.title = title;
        this.description = description;
        this.color = parseInt(color, 16);
        if(url) this.thumbnail = { url: url }
    };
}