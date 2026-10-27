# Business IGCSE — Learn, Practise, Improve

A revision website for **Pearson Edexcel International GCSE Business (4BS1)**. Learn key concepts, revise topics, practise exam-style multiple-choice questions and track your revision progress.

## Features

- **Topic revision:** Organised lessons with explanations, key points, examples and exam tips.
- **Five syllabus sections:** Business activity and influences on business, people in business, business finance, marketing, and business operations.
- **Search:** Find lessons using topic names, keywords and related terms.
- **Practice quizzes:** Test your understanding with multiple-choice questions and explanations.
- **Revision progress:** Keep track of your progress on your device.
- **AI tutor / revision help:** Use the revision assistance provided by the website, subject to its implementation and configuration.
- **Progressive Web App (PWA):** Install the website on compatible devices if the PWA configuration is set up correctly.
- **Responsive design:** Designed for use on desktop, tablet and mobile screens.

## Getting Started

### 1. Download or clone the project

If the project is hosted on GitHub, open its repository and download the source files, or clone it using Git.

### 2. Check the project structure

The project should contain the main website files and the content folder. For example:

```text
business-igcse/
├── index.html
├── config.js
├── app.js
├── practice.js
├── tutor.js
├── pwa-register.js
├── styles.css
├── manifest.json
├── service-worker.js
├── content/
│   ├── content-1.js
│   ├── content-2.js
│   ├── content-3.js
│   ├── content-4.js
│   ├── content-5.js
│   ├── content-6.js
│   ├── content-7.js
│   └── content-8.js
└── README.md
```

The exact filenames may differ depending on the final implementation. Make sure the filenames and paths referenced by `index.html` match the files in your repository.

### 3. Run the website

The website should be served through a local web server or static hosting platform rather than relying on opening `index.html` directly.

For local testing, use a development server that serves the project directory.

### 4. Deploy using Netlify

1. Upload the project to a GitHub repository.
2. Sign in to Netlify.
3. Choose **Add new project** and import the GitHub repository.
4. For a plain HTML, CSS and JavaScript website, leave the build command empty unless the project requires one.
5. Set the publish directory to the project root if `index.html` is located there.
6. Deploy the site.
7. Open the deployed URL and test the lessons, quizzes, tutor and progress tracking.

## Progress and Privacy

Revision progress is intended to be stored locally in the browser, without requiring a user account or Supabase database.

This means:

- Progress may be available only in the browser and on the device where it was saved.
- Using another browser or device may show different or empty progress.
- Private browsing, clearing website data or deleting browser storage may erase saved progress.
- Local browser storage should not be treated as a permanent backup.

## AI Tutor

The tutor's functionality depends on the implementation included in the project.

If the tutor requires an external AI API, it may need additional configuration before it works. Never place a private API key in client-side JavaScript or commit it to a public GitHub repository. Any required secret should be configured through the hosting platform's environment variables and accessed through a secure server-side function.

If the tutor uses only the website's own revision content, its answers will be limited by the content available to it.

## Curriculum

The website is intended to support revision for Pearson Edexcel International GCSE Business (4BS1).

Its five main sections are:

1. Business activity and influences on business
2. People in business
3. Business finance
4. Marketing
5. Business operations

Use the official Pearson specification and your teacher's guidance to confirm the full syllabus requirements and exam-board terminology.

## Disclaimer

This is an independent revision resource and is not an official Pearson Edexcel website. Always check the current specification and use official past papers and mark schemes to prepare for examinations.

## Licence

Unless a licence is added to this repository, all rights to the project's original code and content remain with their respective copyright holders. Do not assume the project is open-source or freely reusable for commercial purposes without checking the applicable rights.
