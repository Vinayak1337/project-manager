import { Listener, ProjectStatus } from "../index";
import { Project } from "../Models/project";

export abstract class Store<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

export class ProjectStore extends Store<Project> {
    private projects: Project[] = [];
    private static instance: ProjectStore;

    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectStore();
        return this.instance;
    }

    addProject(title: string, description: string, people: number) {
        const newProject = new Project(
                Math.random().toString(),
                title, description, people,
                ProjectStatus.Active,
        )
        this.projects.push(newProject);
        
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }

    moveProject(id: string, newStatus: ProjectStatus) {
    const project = this.projects.find(p => p.id === id);
    if (project && (project.status !== newStatus)) {
        project.status = newStatus;
        this.updateListeners();
    }
    }

    private updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}

export const projectStore = ProjectStore.getInstance();