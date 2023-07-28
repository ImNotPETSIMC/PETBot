# PETBot

PETBot is a discord bot created to help managing and storing PET-SIMC related information.
Uses Firestore as main form of storage.


<h1>Features:</h1>

<ul>
    <li>Member Register</li>
    <li>Member Update</li>
    <li>Member Remove</li>
    <li>Member Search</li>
    <li>Member Status</li>
    <li>Member Show</li>
    <li>Project Register</li>
    <li>Project Update</li>
    <li>Project Remove</li>
    <li>Project Search</li>
    <li>Project Status</li>
    <li>Project Show</li>
</ul>

-----

<h3>Member Register</h3>
<img src="src/assets/member_register.png" title="Member Register" height="500px"></img>
Using the "member_register" command you can register a new PET-SIMC member/ex-member.<br>
Photos are downloaded and stored in Firestore, limited to 1MiB.  

-----

<h3>Member Update</h3>
<img src="src/assets/member_update.png" title="Member Update" height="500px"></img>
Using the "member_update" command you can update a PET-SIMC member/ex-member information.<br>
Photos are downloaded and stored in Firestore, limited to 1MiB.  

-----

<h3>Member Remove</h3>
<img src="src/assets/member_remove.png" title="Member Remove" height="500px"></img>
Using the "member_remove" command you can delete a PET-SIMC member/ex-member register.<br>

-----

<h3>Member Search</h3>
<img src="src/assets/member_search.png" title="Member Search" height="500px"></img>
Using the "member_search" command you can retrieve a PET-SIMC member/ex-member register.<br>

-----

<h3>Member Status</h3>
<img src="src/assets/member_status.png" title="Member Status" height="500px"></img>
Using the "member_status" command you can update a PET-SIMC member/ex-member status to member or ex-member.<br>

-----

<h3>Member Show</h3>
<img src="src/assets/member_show.png" title="Member Show" height="500px"></img>
Using the "member_show" command you can retrieve all PET-SIMC member/ex-member registers.<br>

-----

<h1>Instructions</h1>

<ul><h3>Requirements:</h3> 
    <li>Firestore</li>
    <li>Discord App</li>
</ul>


Create a Firebase Database app in (https://firebase.google.com/) and insert it's credentials into .env as show in .env.example.<br>
Create a Discord app in (https://discord.com/developers/applications) and insert it's token and client-id into .env as show in .env.example.

After setting up, you can start the project with: 

```bash
npm install
npm run dev
```
