{
  "name": "allpdf-tools",
  "version": "1.0.0",
  "description": "Free online PDF tools",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1",
    "pdf-lib": "^1.17.1",
    "sharp": "^0.32.6"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}