# Project Title

## Overview

It is a web app where users can play a puzzle game called Kakuro with each other in real time. Kakuro (or cross sums) is a game similar to sudoku where there are target numbers on a grid and players have to find the correct numbers from 1-9 that add up to the target numbers.

### Problem Space

There are Kakuro websites that exist but they are outdated and lack functionality. I want to create something that makes it easy to play Kakuro and that will get more people interested in the game. 

Also unlike the other Kakuro sites, the web app allows multiple players to play on the same puzzle in real time. With things like google docs and draw.chat, real time online collaboration between people is becoming popular. 

Puzzle games like Sudoku and Kakuro improve logical thinking and problem-solving skills, enhance concentration, boost memory and helps maintain brain health as we age. 

### User Profile

The app will be used by everyone, young and old. Right now Kakuro is mostly played by adults and seniors (for the maintaining cognitive health aspect), but I want the web app to also appeal to a younger audience. 

I want the web app to be as easy as possible to use. A player will be able to enter the site, click on a grid size they want and then start playing. The will have an option to share their game url/code with others so that they too can play on that same puzzle together. 

### Features

When on homepage users can select the grid size they want to play (ie. 5x5, 8x8 etc grid) When clicking on a grid, the website takes them to a new page with the grid size they want to play on. They can start filling in numbers and there will be an indicator when they get the correct solution. 

There will be an optional timer that users can set to time themselves, there will be a button to show the solution to the puzzle and a button to take them to the next or previous puzzle for that grid size.

Users will also be able to click a button to share that puzzle so that they can work on that puzzle with other people in real time. The user will be asked to create a name (that does not already exists), which other players can search for the game on the site or go to that puzzles url.

Users will also be able to create their own Kakuro puzzles. 

## Implementation

### Tech Stack

I will be using React to create the app, use Supabase to save the grids and for the real time collaboration functionality, and will use Cloudflare to host the website.

### APIs

The app uses the PostgreSQL database provided by Supabase. All data is stored and managed within this database.

### Sitemap

List the pages of your app with brief descriptions. You can show this visually, or write it out.

Home page - There will be a default 5x5 grid so that new users can quickly play Kakuro. Below it, there will be images of different grid sizes, that allow users to choose a specific grid size they would like to play.

Puzzle page - After selecting a grid, they will be taken to a puzzle page that will display a puzzle of the chosen grid size. They can choose a different grid size from this page, and have an option to play the puzzle with someone else. There will be buttons to go to the next puzzle.

Create puzzle page - Users can create there own puzzle. They can choose the size, layout and enter numbers to design the puzzle. They can choose a specific grid size for their puzzle. They will have to name the puzzle with a name (one that isn't already taken) and then others can find the puzzle by using the search box on the home page.

Instructions - A page that has instructions for new users on how to play Kakuro. 

### Mockups

https://docs.google.com/presentation/d/1tqIXYB6dyCE77lv-kmtd_0m6eAqdQy8oJnnC-Nk88vY/edit?usp=sharing

### Data

List table - 
id (primary key)
grid_id (foreign key)
name VARCHAR(255)

Grid Table - 
Grid_id (primary key)
row (INTEGER)
column (INTEGER)
grid_layout (JSON)


### Endpoints

Examples:
-supabase.from('grids').select('*').eq("name")  - will get an object containing all columns from the grids table
-supabase.from('grids').update()     - for updating
-supabase.from('grids').insert()     - for adding data

-example response:
{
  "id": 1,
  "name": "name",
  "data": {
    "cells": [
      { "id": 1, "value": "A1" },
      { "id": 2, "value": "B1" },
      etc
    ]
  }
}

-channel.on(                     - Real-time grid updates
'postgres_changes',
{ event: '*', schema: 'public', table: 'grids'},
(res) => {
setGridData(res.new.data);
}
).subscribe();


## Roadmap

Task 1: Set Up 
Set up the React app and organize the project structure (components, utils, etc.).
Time: 0.5 day

Task 2: Puzzle Creation page
Make the puzzle creation page. Make a grid and functionality for users to make their own Kakuro puzzle Implement and to save the puzzle data.
Time: 3 days

Task 3:  Puzzle Validation Logic
Create validation to check if the puzzle follows Kakuro rules.
Time: 2 days

Task 4: Set Up Local Server
Set up a local server to save puzzle data as JSON files.
Time: 1 days

Task 5: Search Feature
Search functionality where users can search for saved puzzles by name.
Time: 1 days

Task 6: Puzzle Page
Allow users to input numbers and attempt to solve the puzzle.
Time: 1 days

Task 7: Supabase Setup 
Set up Supabase for database management and basic multiplayer functionality for multiple users to interact with puzzle together in real-time.
Time: 2 days

Task 8: Testing & Bug Fixing
Time: 1 days

Task 9: Final adjustments
Styling, instruction page etc
Time: 1 day

---

## Future Implementations

-A chat box where users can talk with each other while solving the puzzle

-Save progress feature - Make an option for players to save their puzzles that they are working on in localstorage.There will be an area on the homepage that shows their saved puzzles. 

