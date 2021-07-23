import { AutoBind } from "../Decorators/auto-bind";
import { Draggable } from "../index";
import { Project } from "../Models/project";
import { Component } from "./component";

export class ProjectItem extends Component <HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;

    get persons() {
        return this.project.people > 1 ? `${this.project.people} persons` : `${this.project.people} person`
    }

    constructor(hostId: string, project: Project) {
        super('single-project', hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    @AutoBind
    dragStartHandler(event: DragEvent) {
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = 'move';        
    }

    @AutoBind
    dragEndHandler(_event: DragEvent) {
        console.log('event end');
    }

    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }

    renderContent() {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
        this.element.querySelector('p')!.textContent = this.project.description;
    }
}    