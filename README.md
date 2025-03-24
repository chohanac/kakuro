# Project Title

## Overview

What is your app? Give a brief description in a couple of sentences.

It is a web app where users can play a puzzle game called Kakuro with each other in real time. Kakuro (or cross sums) is a game similar to sudoku where there are target numbers on a grid and players have to find the correct numbers from 1-9 that add up to the target numbers.

### Problem Space

Why is your app needed? Give any background information around any pain points or other reasons.

There are Kakuro websites that exist but they are outdated and lack functionality. I want to create something that makes it easy to play Kakuro and that will get more people interested in the game. 

Also unlike the other Kakuro sites, the web app allows multiple players to play on the same puzzle in real time. With things like google docs and draw.chat, real time online collaboration between people is becoming popular. 

Puzzle games like Sudoku and Kakuro improve logical thinking and problem-solving skills, enhance concentration, boost memory and helps maintain brain health as we age. 


### User Profile

Who will use your app? How will they use it? Add any special considerations that your app must take into account.

The app will be used by everyone, young and old. Right now Kakuro is mostly played by adults and seniors (for the maintaining cognitive health aspect), but I want the web app to also appeal to a younger audience. 

I want the web app to be as easy as possible to use. A player will be able to enter the site, click on a grid size they want and then start playing. The will have an option to share their game url/code with others so that they too can play on that same puzzle together. 

### Features

List the functionality that your app will include. These can be written as user stories or descriptions with related details. Do not describe _how_ these features are implemented, only _what_ needs to be implemented.

When on homepage users can select the grid size they want to play (ie. 5x5, 8x8 etc grid) When clicking on a grid, the website takes them to a new page with the grid size they want to play on. They can start filling in numbers and there will be an indicator when they get the correct solution. 

There will be an optional timer that users can set to time themselves, there will be a button to show the solution to the puzzle and a button to take them to the next or previous puzzle for that grid size.

Users will also be able to click a button to share that puzzle so that they can work on that puzzle with other people in real time. The user will be asked to create a name (that does not already exists), which other players can search for the game on the site or go to that puzzles url.

Users will also be able to create their own Kakuro puzzles. 

## Implementation

### Tech Stack

List technologies that will be used in your app, including any libraries to save time or provide more functionality. Be sure to research any potential limitations.

I will be using React to create the app, use Supabase to save the grids and for the real time collaboration functionality, and will use Cloudflare to host the website.

### APIs

List any external sources of data that will be used in your app.

The app uses the PostgreSQL database provided by Supabase. All data is stored and managed within this database.


### Sitemap

List the pages of your app with brief descriptions. You can show this visually, or write it out.

### Mockups

Provide visuals of your app's screens. You can use pictures of hand-drawn sketches, or wireframing tools like Figma.

### Data

Describe your data and the relationships between the data points. You can show this visually using diagrams, or write it out. 

### Endpoints

List endpoints that your server will implement, including HTTP methods, parameters, and example responses.

Examples - supabase.from('grids').select('*').eq('name', searchName).single()  will get an object containing all columns from the grids table where the 'name' matches the provided 'searchName'



## Roadmap

Scope your project as a sprint. Break down the tasks that will need to be completed and map out timeframes for implementation working back from the capstone due date. 

---

## Future Implementations
Your project will be marked based on what you committed to in the above document. Here, you can list any additional features you may complete after the MVP of your application is built, or if you have extra time before the Capstone due date.

Save progress feature - Make an option for players to save their puzzles that they are working on in localstorage.There will be an area on the homepage that shows their saved puzzles. 

