import { AutoBind } from "../Decorators/auto-bind";
import { DragTarget, ProjectStatus } from "../index";
import { Project } from "../Models/project";
import { projectStore } from "../Stores/ProjectStore";
import { Component } from "./component";
import { ProjectItem } from "./project-item";

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects!: Project[];

    constructor(private type: 'active' | 'finished') {
        super('project-list', `app`, false, `${type}-projects` );

        this.configure()
        this.renderContent();
    }

    @AutoBind
    dragOverHandler(event: DragEvent) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();   
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
    }

    @AutoBind
    dragLeaveHandler(_event: DragEvent) {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    }

    @AutoBind
    dropHandler(event: DragEvent) {
        const prjId = event.dataTransfer!.getData('text/plain');
        projectStore.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
    }

    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        
        projectStore.addListener((projects: Project[]) => {
            const releventProjects = projects.filter(prj => {
                return this.type === 'active' ? prj.status === ProjectStatus.Active : prj.status === ProjectStatus.Finished;
            })
            this.assignedProjects = releventProjects;
            this.renderProjects();
        })
    }

    private renderProjects() {
        const listElement = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;

        listElement.innerHTML = '';
        for (const project of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, project);
        }
    }
    
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }
}