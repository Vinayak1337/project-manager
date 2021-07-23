import { AutoBind } from "../Decorators/auto-bind";
import { Validatable } from "../index";
import { projectStore } from "../Stores/ProjectStore";
import { validate } from "../Utils/validation";
import { Component } from "./component";

export class ProjectInput extends Component <HTMLDivElement, HTMLElement> {
    titleInputElement!: HTMLInputElement;
    descriptionInputElement!: HTMLInputElement;
    peopleInputElement!: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input');

        this.configure();
    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
            minLength: 3,
            maxLength: 16,
        }

        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 10,
            maxLength: 260,
        }

        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 10,
        }
        
        if ([titleValidatable, descriptionValidatable, peopleValidatable].some(validatable => !validate(validatable))) {
            alert('Invalid input.');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }

    }

    private clearInput() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @AutoBind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput()!;
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            projectStore.addProject(title, description, people);
            this.clearInput();
        }
    }

    configure() {
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.element.addEventListener('submit', this.submitHandler);
    }

    renderContent(): void
    {
        throw new Error("Method not implemented.");
    }
}