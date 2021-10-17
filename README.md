# RefTracker | Track Referrals Privately
### How to setup
#### Prerequisites
1. A Cloudflare account
2. A Fauna Account
3. Cloudflare Wrangler Installed
4. A Github Account
5. A Basic Knowlage of Git / GitHub
#### Setting Up Fauna
Our first step will be configuring a database through Fauna's dashboard.  
After you've logged into the dashboard, create a new database named RefTracker and choose a region closest to your users:  
<img src="https://user-images.githubusercontent.com/44110596/137605123-5fc94b6c-5e40-493e-a51f-acd9d6b35a39.png" alt="DB Creation" height="300"/>

#### Creating the referral catalog
We're now going to create the `Referrals` collection to store the documents for our inventory.  
To accomplish this, we're going to execute an FQL query on the Fauna shell which is available from the main menu of the dashboard:  
<img src="https://user-images.githubusercontent.com/44110596/137605210-6f591a6b-c542-46d4-8e63-74ad198165da.png" alt="Referral catalog creation" height="300"/> 

To create a collection, simply execute the following FQL query that uses the CreateCollection function:  
```
CreateCollection({name: "Referrals"})
```

The result will be similar to this:  
```
{
  ref: Collection("Referrals"),
  ts: 1617851434855000,
  history_days: 30,
  name: "Referrals"
}
```
#### Creating a server key
To be able to connect to the database from a Worker we now need to create a key.  
Go to the `Security` section of the dashboard and create a new key with the `Server` role:  
<img src="https://user-images.githubusercontent.com/44110596/137605321-efa6594c-f03e-44c6-b18d-b48c25b37111.png" alt="Server key creation" height="300"/>  

After saving, Fauna will show us the key's secret which we'll use to execute queries from our Worker:
<img src="https://user-images.githubusercontent.com/44110596/137605382-e691a087-2488-432a-9daa-e0f19f890a63.png" alt="Referral catalog creation" height="300"/> 

Save the secret somewhere safe as Fauna will never show it again.  
Also, never commit this secret to your Git repository. The Server role is all-powerful. Anyone with this secret would have full access to the database. The initial configuration of Fauna is ready.  

#### Github Configuration
[Fork this on github](https://github.com/widelachie/RefTracker/fork)
and pull it to your computer. (If your using this I would assume you would know what I'm talking about)

#### Wrangler Config
Login to Cloudflare.
```
wrangler login
```

Run
```
wrangler secret put FAUNA_SECRET
```
then paste your Fauna Secret saved earlier.

#### File Config
Open `index.js` and modify `regionString`, `corsOriginDomain`, `collectionName`, `siteName`, `refPath`, `githubRefTrackerUrl` to the respective labeled values
