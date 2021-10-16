const corsOriginDomain = "*"
const collectionName = 'LKRefs'
const siteName = 'LK'

import faunadb from 'faunadb';
import {customFetch, getFaunaError} from './utils.js';

const faunaClient = new faunadb.Client({
  secret: FAUNA_SECRET,
  domain: 'db.eu.fauna.com',
  scheme: 'https',
  fetch: customFetch
});

const {Create, Collection, Match, Index, Get, Ref, Paginate, Sum, Delete, Add, Select, Let, Var, Update} = faunadb.query;

async function handleRequest(request) {
  const content = await request.json()
  const referrer = content.referrer;
  console.log(`Creating ref for LK. Referrer: ${referrer}`)
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
    console.log(`Ref Created for LK. DB Ref ID: ${result.ref.id}`)
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
    return new Response(JSON.stringify(faunaError), { status: faunaError.status, headers: { 'Content-type': 'application/json', ...corsHeaders(allowedOrigin) } })
  }
}
// CF Worker Event Listener
addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request))
})
