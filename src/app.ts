// Validation logic
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number; // checks length of the string
    maxLength?: number;
    min?: number; // checks the value of a number
    max?: number;
}

function validate(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid &&  validatableInput.value.toString().trim().length !== 0;
        // validatableInput can be a number OR a string, this makes sure it's converted to a string to check the length
        // if ^ is not 0, isValid is true. If it is 0, it changes isValid to false. Only does stuff if 'required' has a value
    }
    return isValid;
}

// autobind decorator - can use this instead of calling bind on this.submitHandler. Can reuse the decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  // the underscores allows the parameters to not be used
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      // does its thing when the function is called
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  };
  return adjustedDescriptor;
}

// ProjectInput Class

class ProjectInput {
  // to get access to templates and render them from index.html
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    // gives access to the template
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
    //! tells TypeScript this will never be null. 'as' tells TS this will  be the HTMLTemplateElement type
    // where I want to render the template
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    // to render - we need to import the content of the template
    // importNode is a global thing
    const importedNode = document.importNode(this.templateElement.content, true);
    // content is a property that exists on HTMLTemplateElement. Gives a reference to the content of the template.
    // 'true' says to import all levels of nesting in the content
    this.element = importedNode.firstElementChild as HTMLFormElement;
    // ^ this points at the actual node we want to insert
    this.element.id = 'user-input'; // render element uses this id from the css file for styling

    // The title, desc, and people are parts of the form we want access to
    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

    //to get access to the different parts of the form
    this.configure();
    this.attach(); // puts attach inside this block so that code runs when attach is called
  }

  private gatherUserInput(): [string, string, number] | void { // : returns a tuple or void/undefined
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    if (
      validate({value: enteredTitle, required: true, minLength: 5}) &&
      validate({value: enteredDescription, required: true, minLength: 5}) &&  
      validate({value: enteredPeople, required: true, minLength: 5})   
    ) {
        alert('Invalid input, please try again');
        return; // a "void" return is ok, it's one of the return types
    } else {
        return[enteredTitle, enteredDescription, +enteredPeople] // the + converts it to a number - it's supposed to be a number type
    }
  }

  // After entering the inputs and clicking enter, we want to clear the input boxes
  private clearInputs() {
      this.titleInputElement.value = '';
      this.descriptionInputElement.value = '';
      this.peopleInputElement.value = '';
  }

  @autobind //decorator
  private submitHandler(event: Event) {
    event.preventDefault(); // doesnt submit http request with this
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) { // check that userInput is a tuple/array
        const [title, description, people] = userInput
        console.log(title, description, people);
        this.clearInputs(); // clears form once it's submitted
    } 
  }

  private configure() {
    // set up event listener
    this.element.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
    // first argument is when to render it
  }
}

const prjInput = new ProjectInput(); // will see the form with this. (form comes from the html file)
