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

export class Member {
    name: string;
    photo_url: string;
    matricula: string;
    admission_year: number;
    email: string;
    github_url: string;
    instagram_url: string;
    linkedin_url: string;
    lattes_url: string;
    status: string;
    projects: string[];

    constructor(name: string, photo_url: string, matricula: string, admission_year: number, email: string, github_url: string, instagram_url: string, linkedin_url: string, lattes_url: string, status: string, projects?: string[]) {
        this.name = name;
        this.photo_url = photo_url;
        this.matricula = matricula;
        this.admission_year = admission_year;
        this.email = email;
        this.github_url = github_url;
        this.instagram_url = instagram_url;
        this.linkedin_url = linkedin_url;
        this.lattes_url = lattes_url;
        this.status = status;
        if(projects) this.projects = projects;
    };
}

export class Project {
    name: string;
    type: string;
    photo_url: string;
    description: string;
    status: string;

    constructor(name: string, type: string, photo_url: string, description: string, status: string) {
        this.name = name;
        this.type = type;
        this.photo_url = photo_url;
        this.description = description;
        this.status = status;
    };
}