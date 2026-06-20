# SmartScholar Documentation

## Project Overview

SmartScholar is an AI-powered academic assistant built using React and Express.

## Features

### Assignment Tracker

* Add assignments
* Store assignments using Local Storage
* Upload assignment files

### Attendance Tracker

* Mark Present
* Mark Absent
* Calculate Attendance Percentage
* Attendance Warning System

### Notes Upload

* Upload text notes
* Upload image notes
* Display uploaded content

### AI Summary Generator

* Generates summaries using Google Gemini API

### AI Quiz Generator

* Generates quiz questions using Google Gemini API

## Frontend Structure

src/
├── App.jsx
├── App.css
├── main.jsx

## Backend Structure

server.js

### API Endpoints

POST /summary

* Receives notes
* Returns AI-generated summary

POST /quiz

* Receives notes
* Returns AI-generated quiz

GET /

* Health check endpoint

## Environment Variables

Create a .env file:

GEMINI_API_KEY=YOUR_API_KEY

## Installation

Frontend:

npm install
npm run dev

Backend:

node server.js

## Deployment

Frontend:

* Vercel

Backend:

* Render

## Future Scope

* Authentication
* Cloud Storage
* OCR Processing
* PDF Support
* Study Analytics
