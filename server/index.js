

import faunadb from 'faunadb';
import {customFetch, getFaunaError, NotFound, MethodNotAllowed} from './utils.js';

const faunaClient = new faunadb.Client({
  secret: FAUNA_SECRET, // Defined as a cloudlfare secret
  domain: 'db.eu.fauna.com', // Change to your region
  scheme: 'https',
  fetch: customFetch
});

const corsOriginDomain = "https://lachlankemp.com" // Set tracked page domain
const collectionName = 'LKRefs' // DB Collection Name
const siteName = 'LK' // Arbitrary Site Name
const refPath = '/lkref' // Path for incoming data
const githubRefTrackerUrl = 'https://raw.githubusercontent.com/widelachie/RefTracker/main/client/reftracker.min.js'

const {Create, Collection, Match, Index, Get, Ref, Paginate, Sum, Delete, Add, Select, Let, Var, Update} = faunadb.query;


async function handleRequest(request) {
  const url = new URL(request.url)

  // Disallow Other Methods
  console.log(request.method)
  if (request.method !== 'GET' && request.method !== 'POST') {
    return MethodNotAllowed(request)
  }

  if (url.pathname === '/reftracker.min.js' && request.method === 'GET') {
    return fetch(githubRefTrackerUrl)

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
