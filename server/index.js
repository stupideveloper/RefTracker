import { regionString, corsOriginDomain, collectionName, siteName, refPath, githubRefTrackerUrl } from './configuration.json'

import faunadb from 'faunadb';
import {customFetch, getFaunaError, NotFound, MethodNotAllowed, gatherFileResponse} from './utils.js';

const faunaClient = new faunadb.Client({
  secret: FAUNA_SECRET, 
  domain: regionString, 
  scheme: 'https',
  fetch: customFetch
});

const {Create, Collection, Match, Index, Get, Ref, Paginate, Sum, Delete, Add, Select, Let, Var, Update} = faunadb.query;

async function respondWithFile(request) {
  const init = {
    headers: {
      "content-type": "text/javascript",
    },
  }
  const dataResponse = await fetch(githubRefTrackerUrl, init)
  const results = await gatherFileResponse(dataResponse)
  const response = new Response(results, init)
  // Set Cors Headers
  response.headers.set("Access-Control-Allow-Origin", corsOriginDomain)
  response.headers.set("Access-Control-Allow-Methods", 'POST,GET')
  return response
}

async function handleRequest(request) {
  const url = new URL(request.url)

  // Disallow Other Methods
  console.log(request.method)
  if (request.method !== 'GET' && request.method !== 'POST') {
    return MethodNotAllowed(request)
  }

  // Client JS Path
  if (url.pathname === '/reftracker.min.js' && request.method === 'GET') {
    return respondWithFile(request)
  }

  // Data input path
  if (url.pathname === refPath && request.method === 'POST') {
    const content = await request.json()
    const referrer = content.referrer;

    console.log(`Creating ref for ${siteName}. Referrer: ${referrer}`)
    try {
      // Create Database Entry
      const result = await faunaClient.query(
        Create(
          Collection(collectionName),
          {
            data: {
              'site': siteName,
              'siteReferrer': referrer,
              'cf': request.cf
            }
          }
        )
      );
      console.log(`Ref Created for ${siteName}. DB Ref ID: ${result.ref.id}`)

      // Send Response to user
      let response = new Response(JSON.stringify({
        dbref: result.ref.id
      }))

      // Set cors headers
      response.headers.set("Access-Control-Allow-Origin", corsOriginDomain)
      response.headers.set("Access-Control-Allow-Methods", 'POST,GET')
      return response
      
    } catch (error) {
      // Handle Errors
      const faunaError = getFaunaError(error);
      console.error(faunaError)

      // Send Error to user
      return new Response(JSON.stringify(faunaError), { status: faunaError.status, headers: { 'Content-type': 'application/json', ...corsHeaders(allowedOrigin) } })
    }
  }
  // Redirect to home page if root
  if(url.pathname === '/') {
    return Response.redirect(corsOriginDomain, 301)
  }
  // Return 404 if not found
  return NotFound(request)

}
// CF Worker Event Listener
addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request))
})
