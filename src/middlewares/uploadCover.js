const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { randomUUID } = require('crypto');
const config = require("../config/env");

fs.mkdirSync(config.upload.dir, { recursive: true });

const storage = multer.diskStorage({

    destination: function(req, file, cb) {

        cb(
            null,
            path.join(config.upload.dir)
        );
    },


    filename: function(req, file, cb) {

        const extensions = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp'
        };
        cb(null, `${randomUUID()}${extensions[file.mimetype]}`);
    }

});


const uploadCover =
    multer({
        storage: storage,
        limits: {
            fileSize: 2 * 1024 * 1024 // 2 MB
        },
        fileFilter: function(req, file, cb) {

            const tipiConsentiti = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (tipiConsentiti.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(
                    new Error(
                        "Formato immagine non supportato."
                    )
                );
            }
        }
    });


module.exports = uploadCover;
