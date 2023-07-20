export class Embed {
    "title": string;
    "description": string;
    "color": number;
    
    constructor(title: string, description: string, color:string) {
        this.title = title;
        this.description = description;
        this.color = parseInt(color, 16);
    };
}

export class Member {
    name: string;
    photo_url: string;
    register_code: string;
    admission_year: number;
    email: string;
    github_url: string;
    instagram_url: string;
    linkedin_url: string;
    lattes_url: string;
    status: string;

    constructor(name: string, photo_url: string, register_code: string, admission_year: number, email: string, github_url: string, instagram_url: string, linkedin_url: string, lattes_url: string, status: string) {
        this.name = name;
        this.photo_url = photo_url;
        this.register_code = register_code;
        this.admission_year = admission_year;
        this.email = email;
        this.github_url
        this.instagram_url = instagram_url;
        this.linkedin_url = linkedin_url;
        this.lattes_url = lattes_url;
        this.status = status;
    };
}