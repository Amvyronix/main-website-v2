


import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";
//import { v4 as uuid } from "uuid";

export default async (req: Request, context: Context) => {

	console.log('method is called')

  const API_KEY = process.env.GOOGLE_DRIVE_AUTH_KEY;

  const API = 'https://www.googleapis.com/drive/v3/files?key='+API_KEY;
  
  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis')
  
  const auth = new GoogleAuth({
	//keyfile: KEYFILEPATH,
    scopes: 'https://www.googleapis.com/auth/drive'
  });
  
  const service = google.drive({version: 'v3', auth});
  
  // Accessing the request as `multipart/form-data`.
  const form = await req.formData();
  console.log('received form data')
  
  const file = form.get("file") as File;
  console.log('created file object')

  
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
    const file2 = await service.files.create({
      requestBody,
      media: media,
    });
    console.log('File Id:', file2.data.id);
   // return file.data.id;
  } catch (err) {
    // TODO(developer) - Handle error
	console.log('got error');
	console.log(err)
    throw err;
  }



  // Accessing the request as `multipart/form-data`.
 // const form = await req.formData();
 // const file = form.get("file") as File;

  // Generating a unique key for the entry.
 // const key = uuid();
  

  return new Response("Submission saved");
};
