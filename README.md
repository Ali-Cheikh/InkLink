# InkLink 🎨

InkLink is a responsive, full-screen drawing web application that allows users to create, edit, and download their artwork. Designed for both desktop and mobile devices, this app offers a variety of features, including customizable brush size, color options, undo/redo history, and a shareable image link. This document provides an overview of the app's structure and functionalities for developers.

## Table of Contents
- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [Development](#development)
- [License](#license)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Ali-Cheikh/inklink.git
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```

## Features

- **Canvas Drawing**: Draw freehand with a customizable brush color and size.
- **Touch and Mouse Support**: Works smoothly on both touch devices and desktops.
- **Undo/Redo**: Navigate through your drawing history with the undo and redo buttons.
- **Color Picker and Line Width Adjustments**: Customize the brush color and width for detailed drawing control.
- **Save and Download**: Save your drawing locally, and download it as an image.
- **Shareable Link**: Generate and copy a link to your drawing that others can view.
- **Responsive UI**: Designed for both desktop and mobile with collapsible side controls for easy access.
- **Zoom Controls**: Scale the canvas to zoom in/out for finer control.

## How It Works

1. **Drawing**: Start drawing by clicking/touching the canvas. Adjust your drawing color and line width using the side panel or toolbar.
2. **Save/Download**: Click 'Set' to save your current drawing to local storage. Download as an image by clicking the 'Download' button.
3. **Undo/Redo**: Use the undo and redo buttons to revert to previous drawing states.
4. **Share Link**: Generate and copy a link to your image to share with others.

## Usage

1. Open the app in a web browser.
2. Use the sidebar tools to adjust brush settings.
3. Draw on the canvas, manage history with undo/redo, zoom, and download or share the image.

## Development

- **Canvas API**: Core drawing functionality leverages the HTML5 Canvas API for rendering.
- **State Management**: Uses JavaScript objects to track canvas history.
- **CSS**: Styled for responsiveness, especially on mobile, with a collapsible sidebar with **Bootstrap** library.
- **SweetAlert2**: Integrated for user notifications.

Feel free to extend InkLink with additional features! Contributions are welcome through pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.
