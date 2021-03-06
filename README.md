# Six Lessons in React
Six lesson collaborative learning course in React JS

- [Prerequisites](https://github.com/grantt/six_lessons_in_react/tree/master/README.md#prerequisites)
- [Getting Started](https://github.com/grantt/six_lessons_in_react/tree/master/README.md#getting-started)
- [Syllabus](https://github.com/grantt/six_lessons_in_react/tree/master/README.md#syllabus)

# Prerequisites
For these lessons, I am assuming the user has a novice or greater understanding of HTML, Javascript, CSS, browser rendering, and the request-response process.

# Getting Started

1. `npm install`
  * Reads dependencies from `package.json` and installs them.
2. `./node_modules/.bin/gulp`
  * Starts a web server and watches source folders for changes. When any files are changed, build files will be rebuilt and your browser will automatically refresh.
  * This will also load the first lesson of the React introductory class.
3. You might also want to install [React Developer Tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi).
4. Go to [localhost:3000/lesson_1/lesson.html](http://localhost:3000/lesson_1/lesson.html).

# Syllabus

## Lesson 0
### Introduction, JSX, and Virtual DOM
*  Introduction
  *  What are we doing here?
  *  How does this whole thing work?
  *  Modern Web Applications are hard
*  What is React JS?
  *  Lightweight open-source Javascript framework
    *  Simple, declarative, composable
*  Why Use It?
  * Components are the future
  * Efficiency gains
  * A huge community
*  JSX
  *  Faster, safer, easier
  *  In-browser transformation
  *  Precompiled transformation
  *  JSX conditionals
*  Virtual DOM
  *  Updating the DOM
  *  Change detection in the virtual DOM
    *  Pair-wise diffing
    *  List-wise diffing
* Flux
  * Data flow
  * User input
  * Dispatcher
  * Stores
  * Actions

### Exercises

## Lesson 1 - Basics
Introduce basic React components by building a "Hello World" component that has a render method returning JSX. Next we introduce the concept of component properties, default properties, as well as how to render a component in the DOM. Finally, component state and event handlers are introduced.
### Exercises
Hello World Component

## Lesson 2 - Flux and Data
Flux architecture is introduced along with the idea of unidirectional data flow. The Fluxxor implementation of Flux is used for these examples. Actions and stores are introduced to demonstrate the proper construction of data flow. Next, we provide an example of an asynchronous call for data and how they are handled by actions within the Flux paradigm.

### Exercises
Lorem Ipsum Generator and Textarea

## Lesson 3 - Multiple and Advanced Components
Introduction of multiple components listening to a single data store. Registration of additional actions, and use of a controller view to manage the constituent components.

### Exercises
Markdown Input and Preview

## Lesson 4 - CSS in React
Style definition and translation in JSX. Scope of styles to global and component scopes. Pseudo-classes and state management in component.

### Exercises
Styled Markdown Editor

## Lesson 5 - Advanced Actions
Introduction of a sidebar with several actions related to the document, clear and rename. Add complexity to the Flux dispatcher to handle new actions.

### Exercises
Markdown Editor with Sidebar

## Lesson 6 - Advanced Stores and Interaction
Addition of multiple documents by expanding the data store and introducing a tabbed bar to switch between document. Management of an active document to allow the preview and sidebar to listen to the porper actions.

### Exercises
Multi-document Markdown Editor

## Sources
[React documentation](https://facebook.github.io/react/index.html)

[Flux documentation](https://facebook.github.io/flux/docs/overview.html)

[Article comparing Flux implementations](https://reactjsnews.com/the-state-of-flux/)

[Fluxxor documentation](http://fluxxor.com/)

[Marked](https://github.com/chjj/marked)

[dangerouslySetInnerHTML](https://facebook.github.io/react/tips/dangerously-set-inner-html.html)
