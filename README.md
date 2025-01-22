# HearMeOut

**HearMeOut** is a real-time transcription app designed to assist deaf and hard-of-hearing individuals by converting speech to text and vice versa. It features an intuitive and accessible user interface, with a special focus on simplicity and quick deployment.

## Features

- **Real-time Speech-to-Text Conversion:** Instantly transcribes spoken words into text.
- **Text-to-Speech Capability:** Converts written text back into speech for easy communication.
- **Intuitive and Accessible UI:** Designed to be user-friendly for all, with a focus on accessibility for the deaf and hard-of-hearing.
- **Feedback System:** Users can provide feedback in real-time.
- **Navigation Menu:** Easy access to sections like About, Settings, and more.
- **Customizable Themes:** Light and dark mode options for a better user experience.

## Technologies

- **Frontend:**
  - HTML
  - CSS
  - JavaScript
- **Backend:** Strapi (with an optional Node.js backend)
- **Deployment:** Vercel for hosting the app
- **Feedback System:** Zonka for collecting feedback
- **Font:** Pacifico (for the app name)
- **Api:** Google Cloud Console (For the voice and language translation) 

## Getting Started

To run the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/HearMeOut.git
   ```

2. **Install dependencies:** (If applicable)

   For the frontend, you should only need a basic HTML/CSS/JS setup. If you're integrating a backend (Strapi or Node.js), follow the backend setup instructions.

3. **Run the app locally:**
   
   Open `index.html` in your browser or set up the app on your server to view it.

4. **Deploy the app:**

   You can deploy the app easily using Vercel. Once your project is set up on Vercel, it will automatically deploy with every push to the main branch.

   - [Create a Vercel account and link your GitHub repository](https://vercel.com/)
   - Push your changes to GitHub, and Vercel will handle deployment for you.

## Code Structure

Here’s a breakdown of the project’s directory structure:

```
HearMeOut/
├──Assets
|   |
|  favicon.png          #Image/icon is stored here
|
├── index.html          # Main HTML file that structures the app
├── style.css           # CSS file for app styling
├── app.js              # JavaScript file for app functionality
├── README.md           # Project documentation
└── .gitignore          # Gitignore file for ignoring unwanted files
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributing

If you'd like to contribute to this project, please fork the repository, make your changes, and submit a pull request. Make sure to update the README if necessary and follow best practices for writing clean, readable code.

## Acknowledgements

- Special thanks to [Google Fonts](https://fonts.google.com/) for providing the **Pacifico** font.
- Feedback systems like **Zonka** and **Crisp** were integrated for better user interaction and feedback collection.
