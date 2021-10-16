

async function LachlanKemp(request) {
  const content = await request.json()
  try {
    const referrer = content.referrer;
    console.log(`Creating ref for LK. Referrer: ${referrer}`)
    const result = await faunaClient.query(
      Create(
        Collection('LKRefs'),
        {
          data: {
            'site': 'LK',
            'siteReferrer': referrer,
            'cf': request.cf
          }
        }
      )
    );
    console.log(`Ref Created for LK. DB Ref ID: ${result.ref.id}`)

    let response = await fetch(req)
    let newHdrs = new Headers(response.headers)
    newHdrs.set('Access-Control-Allow-Origin', '*')
    return new Response(JSON.stringify({
      referrer: result.ref.id
    }), {
      headers: newHdrs
    })

  } catch (error) {
    const faunaError = getFaunaError(error);
    console.error(faunaError)
    new Response(JSON.stringify(faunaError), { status: faunaError.status })
  }
}
export default LachlanKemp