<h1 align="center" style="border-bottom: none">
  <b>RefTracker</b><br>
 🎅 Track Referrals Privately 🎅<br>
</h1>
<div align="center" style="border-bottom: none">
  <img src="https://img.shields.io/badge/LICENSE-GPL--3.0-brightgreen?style=for-the-badge&logo=none">
  <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/widelachie/RefTracker?color=https%3A%2F%2Fimg.shields.io%2Fgithub%2Fcommit-activity%2Fm%2Fwidelachie%2FRefTracker&style=for-the-badge">
  <img alt="CodeFactor Grade" src="https://img.shields.io/codefactor/grade/github/widelachie/RefTracker?style=for-the-badge">
  <img alt="GitHub branch checks state" src="https://img.shields.io/github/checks-status/widelachie/RefTracker/main?style=for-the-badge">
  
</div>
<br>
<p align="center" style="border-bottom: none">
  Log site referrals efficiently without any large scale, privacy degrading trackers.<br><br>
  [✔] Serverless.  <br>
  [✔] Small client bundle.  <br>
  [✔] Served on Cloudflare.  <br>
  [✔] Privacy focused.  <br>
  [✔] GNU GPL v3.0 Licence.  <br>
  [❌] Readable internal code.  <br>
</p>

 
 
## How to setup
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

Go to <a href="https://dash.cloudflare.com">Cloudflare</a> and open account settings.  
<img src="https://user-images.githubusercontent.com/44110596/137615562-a4bea0fe-42bb-4271-8103-669bce5030fa.png" alt="Cloudflare account" height="300"/> 

Go to the API Tokens tab and generate a new token.  
<img src="https://user-images.githubusercontent.com/44110596/137615644-8296681a-e2cc-4ef9-90f3-df12ae3f6c04.png" alt="Api Tokens Tab" height="300"/> 

Select the `Edit Cloudflare Workers` template.  
Set `Account Resources` to your email address and set `Zone Resources` to "All Zones from an account and your email address.  
<img src="https://user-images.githubusercontent.com/44110596/137615751-fe994c7a-70db-4140-afbb-7851e1c13d59.png" alt="Api config" height="300"/>  
Continue through and create the token. Copy the token and create a new Github secret in settings (Settings => Secrets => New Repository Secret) with the name `CF_API_TOKEN` and paste in the Cloudflare token. Save.



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
Open `configuration.json` and modify `regionString`, `corsOriginDomain`, `collectionName`, `siteName`, `refPath`, `githubRefTrackerUrl` to the respective labeled values
| Variable Name  | Intended Content |
| ------------- | ------------- |
| regionString  | Region string were your database is held. |
| corsOriginDomain  | Page that will be tracked CORS domain. |
| collectionName | The name of your database collection. |
| siteName | Name for logs (Uninportant). |
| refPath | Path of url to send logs to. |
| githubRefTrackerUrl | The path to `reftracker.min.js` in your github repository (`/client/reftracker.min.js`). |


#### Intergrating
Push your changes

#### Client Testing
Create an HTML Document or use your production website.  
To add tracking, put:
```
<script defer data-send-location="https://[Your worker URL]/[refPath]" src="http://[Your worker URL]/reftracker.min.js"></script>
```
in the header, it should automatically start tracking requests.

And thats it, just access your website with `?ref=example` as a paramater and check your database!
