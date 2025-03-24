


import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";
import { Handler } from '@netlify/functions';
import busboy from 'busboy';

const fs = require('fs');
const Readable = require('stream').Readable;


type Fields = {
  image: {
      filename: string;
      type: string;
      content: Buffer;
  }[];
};

var uploadedFile;
var uploadedFilename;

const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');

const credentialsKeys = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const keys = JSON.parse(credentialsKeys);
 
const auth = new GoogleAuth({
  credentials: keys,
  scopes: 'https://www.googleapis.com/auth/drive'
});
const driveService = google.drive({version: 'v3', auth});
  

function parseMultipartForm(event): Promise<Fields> {
  return new Promise((resolve) => {
      const fields = { image: [] };
      const bb = busboy({ headers: event.headers });

      bb.on('file', (name, file, info) => {
        
        uploadedFile = file;

          const { filename, mimeType } = info;

          file.on('data', (data) => {
            console.log('busboy inside file.data');
            uploadedFile = data;
            console.log('file data is: ', data);

            if (!fields[name]) fields[name] = [];

              fields[name].push({
                  filename,
                  type: mimeType,
                  content: data,
              });
              uploadedFilename = filename;
          });
      });

      bb.on('close', () => {
          resolve(fields);
      });

      bb.end(Buffer.from(event.body, 'base64'));
  });
}

export const handler: Handler = async (event) => {
  try {
      const fields = await parseMultipartForm(event);

      if (!fields) {
          throw new Error('Unable to parse image');
      }

      
  try {
    
    const driveResponse = await driveService.files.create({
     
      resource: {
        name: uploadedFilename, // Use the original filename for the uploaded file
        mimeType: 'application/pdf',
        contentType: 'application/pdf',
        parents: ['1hxNwrCcaP4SZ_mhQwTUZJVNdhzmofVy6'],
        fields: 'id',

      },
      media: {
        mimeType: 'application/pdf', // Set the MIME type
        contentType: 'application/pdf',
         body: Readable.from(uploadedFile),
      },
      

    });

    switch (driveResponse.status) {
      case 200:
        console.log('File uploaded successfully');
        break;
    }

    console.log('File Id:', driveResponse.data.id);
   // return file.data.id;
   
  } catch (err) {
    // TODO(developer) - Handle error
	  console.log('got error');
	  console.log(err)
    throw err;
  }



      return {
          statusCode: 200,
          body: JSON.stringify("Submission saved"),
      };
  } catch (error) {
      return {
          statusCode: 400,
          body: error.toString(),
      };
  }
};

