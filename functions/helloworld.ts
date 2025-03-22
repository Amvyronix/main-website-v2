


import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";
//import { v4 as uuid } from "uuid";

export default async (req: Request, context: Context) => {


  const API = 'https://www.googleapis.com/drive/v3/files?key=AIzaSyDa3uj5--PCRyabT8IfgOnPZtNPZeeO74Y'
  
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis')
  
  const auth = new GoogleAuth({
	//keyfile: KEYFILEPATH,
    scopes: 'https://www.googleapis.com/auth/drive'
  });
  
  const service = google.drive({version: 'v3', auth});
  
  // Accessing the request as `multipart/form-data`.
  const form = await req.formData();
  const file = form.get("file") as File;
  console.log(file)

  
  const requestBody = {
    name: 'photo1.jpg',
	parents: ['1hxNwrCcaP4SZ_mhQwTUZJVNdhzmofVy6'],
    fields: 'id'
  };
  const media = {
    mimeType: 'image/jpeg',
    body: file
  };
  try {
    const file = await service.files.create({
      requestBody,
      media: media,
    });
    console.log('File Id:', file.data.id);
   // return file.data.id;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }



  // Accessing the request as `multipart/form-data`.
 // const form = await req.formData();
 // const file = form.get("file") as File;

  // Generating a unique key for the entry.
 // const key = uuid();
  

  return new Response("Submission saved");
};
