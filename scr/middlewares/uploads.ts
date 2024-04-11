import express from "express";
import multer from "multer";
import path from "path";


// Configure storage for multer
const storage = multer.diskStorage({

    // Set destination folder
    destination: (req, file, callback) => {
        callback(null, 'uploads')
    },

    // Set filename
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`)
    }
})


export const upload = multer({ storage: storage  });