# Spotify
#### Video Demo:  <URL HERE>

## Introduction
This is a web application that analyses your Spotify listening history, creates visualization on the attributes of the songs that you listen to, recommends songs based on your Top 5 Tracks or Songs and creates playlists based on those recommendations. It also acts as a Spotify web player where you can play or pause the current song, skip to the next, control the volume of the music played, add the song to your Liked songs. The application uses Node and React.js and API calls to the Spotify server to extract out your information. However, in order to do so, you'd need to login and agree to the authorization. 

## Structure
### React
We used React for the frontend portion of the project. 

### Node
We used Node for the backend portion of the project. 


## Creating the app on Spotify
To create an app on Spotify and use its API, we had to create an app on Spotify's developer site. You will need to input a redirect URI where the users will be redirected after authentication is successful or failed. Spotify will then provide a Client ID, which is a unique identifier for the app and a Client Secret which is the key required to authorize our Web API calls. Both are stored in an environment variable or .env file which is useful to store sensitive information.

## Authorization, tokens (**)


## Login
### Homepage
File: login.js

This page allows your to click a button to be directed to the Spotify log in page. It has a basic description of what the webpage does and a button which will redirect you to Spotify's login page.

### Authentication & Logging in (**)
Write a short para (**)

### Scopes
File: handler.js

After providing login information to your Spotify account, a list of information or scopes will be shown. Scopes allow the application access to specific information and to specific functionalities such as modifying your playlist or getting your saved songs. Scopes also allow the application to take actions on Spotify on the user's behalf. This provides transparency to the user on what the application can do and which specific information the application can access. Upon accepting, the app will only then be able to work. Here are the list of permissions (Scopes) that are used and what information it gives access to and what it can do

1. 'streaming': Play content and control playback on your other devices.
2. 'user-read-private': Access your subscription details.
3. 'user-read-email': Get your real email address.
4. 'app-remote-control': Communicate with the Spotify app on your device.
5. 'user-library-modify': Manage your saved content.
6. 'user-read-playback-state': Read your currently playing content and Spotify Connect devices information.
7. 'user-modify-playback-state': Control playback on your Spotify clients and Spotify Connect devices.
8. 'user-read-currently-playing': Read your currently playing content.
9. 'user-read-playback-position': Read your position in content you have played.
10. 'user-top-read': Read your top artists and content.
11. 'user-library-read': Access your saved content.
12. 'user-read-recently-played': Access your recently played items.
13. 'playlist-modify-public': Manage your public playlists.
14. 'playlist-modify-private': Manage your private playlists.


### Getting information from the Spotify API
File: home.js

Upon successful agreement to the scopes that will be used, the application will then make multiple API calls to the Spotify API which will then pull all the necessary information required for the app to be used. Here's a list of the API calls which are used.

1. Get Current User's Profile - https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile
2. Get User's Top Items - https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
3. Get User's Saved Tracks - https://developer.spotify.com/documentation/web-api/reference/get-users-saved-tracks
4. Get Available Devices - https://developer.spotify.com/documentation/web-api/reference/get-a-users-available-devices
5. Get Recently Played Tracks - https://developer.spotify.com/documentation/web-api/reference/get-recently-played
6. Get Recommendations - https://developer.spotify.com/documentation/web-api/reference/get-recommendations
7. Get User's Playlists - https://developer.spotify.com/documentation/web-api/reference/get-list-users-playlists
8. Update Playlist Items - https://developer.spotify.com/documentation/web-api/reference/reorder-or-replace-playlists-tracks
9. Start/Resume Playback - https://developer.spotify.com/documentation/web-api/reference/start-a-users-playback
10. Set Playback Volume - https://developer.spotify.com/documentation/web-api/reference/set-volume-for-users-playback
11. Save Tracks for Current User - https://developer.spotify.com/documentation/web-api/reference/save-tracks-user
12. Skip to Next - https://developer.spotify.com/documentation/web-api/reference/skip-users-playback-to-next-track
13. Skip to Previous - https://developer.spotify.com/documentation/web-api/reference/skip-users-playback-to-previous-track
14. Set Repeat Mode - https://developer.spotify.com/documentation/web-api/reference/set-repeat-mode-on-users-playback
15. Toggle Playback Shuffle - https://developer.spotify.com/documentation/web-api/reference/toggle-shuffle-for-users-playback

## Application Structure and files
This section describes the how the application is structured, what files are used in the framework and what files or items are used in the overall architecture of the app.

### Application
File: App.js (**)

### Context
File: context.js

Creates context which will be used to store all the data returned from the API calls

### Navigation Bar
File: navbar.js

This javascript is for the navigation bar. By clicking on the different words, the user will then be redirected to the page. There is a function which the user can toggle between Dark mode and Light mode.

### Refresh Tokens
File: refreshtoken.js (**)

### HTTP methods
File: get.js (**)

### API Calls (**)
File: api_calls.js (**)

### Icons
File: icon.js

This javascript contains all the icons that were used in the different webpages. The icons were installed from a package called react-icons. We can then change each icon's colour, change which icon is displayed depending on the state and the icon size. For example, When we press the play button on player, it will change to the pause icon. By selecting the appropriate icons, the user would find the application more intuitive and easier to use without much prompts.

## Web Player

### Spotify Web Player (**)
We coded a web player into the application. Any buttons that you click on the web player will be reflected in your Spotify Desktop App, Spotify Mobile App or Web App. Thus, whilst using the application, you can freely play / pause / skip / change the volume etc without having to go into your Spotify App.

### Player
File: player.jsx (**)

### Volume Slider
File: slider.js

This javascript exports the slider used in the webplayer which controls the volume. 

### Devices
File: getdevice.jsx

This javascript gets checks for all available devices that the user has and if a device is active, it will render the player and play the song. If no devices are active, it will provide a list of devices to choose from, and the user will be able to select which device to activate. Once a device is active or activated, the player will automatically play the song that is in queue.

### Web Playback
File: WebPlayback.jsx (**)

## Application Navigations
These are the navigations that are on top of the app. Clicking each navigation will redirect you to to each part of the app, Home, Top, Analysis, Charts and Recommendations.

### Home (Personal Information)

File: home.js

This page shows your profile name, country, email that is associated with the spotify account, your spotify account url, number of follows and ID. It will show your profile image if you have one.

After logging in, you will be redirected to this page where all the API calls will be made and stored as const or constant values. These const are then stored into an array using Context which is available to all pages in the webpage. We decided to do it this way because we faced several issues where some information were necessary but we couldn't access it because the data was in another js file. Also, most of the data pulled from the API only requires one call. Thus it would be unnecessary to make multiple API calls returning the same result. 

### Top
File: top.js

This page displays your top tracks and artists. Spotify has 3 categories of time frames, Short, Medium and Long term which they use to categorize the time frames. Short is approximately the last 4 weeks, Medium is approximately the last 6 months and Long is calculated from several years of data including all new data. The user can toggle between showing top tracks and artists, choose which time frame that they want to use and show how many items. 

### Analysis
File: analysis.js

This page displays the analysis of either your Top 50 Tracks, Last 50 Saved Tracks or Last 50 Tracks played. Spotify has an audio analysis of the songs on its platform ranging from its rhythm to the tempo. Likewise for this page, you can choose which time frame for your top tracks. Based on the list of available audio analysis, we have chosen Acousticness, Danceability, Energy, Instrumentalness, Loudness, Tempo, Valence. You are able to see the minimum, maximum and the average of each attribute to have a rough gauge of the type of songs that you listen to. If the range of minimum and maximum of Acousticness for example is huge, then you'd know that you listen to both acoustic songs and non acoustic songs, similarly for the rest of the other attributes. The attributes are mostly on a scale of 0 to 1. For example, having a score close to 0 for Acousticness means the that there is a low confidence that the song is acoustic and a score of close to 1 means there is a high confidence that it is acoustic. For Loudness, the numbers are in decibals (dB) and it is an average of the loudness of the track. Tempo is the average tempo of a track in beats per minute (BPM)

### Charts
File: charts.js

This page charts out the attributes your top 50, last 50 saved and last 50 recently played tracks as a line chart. We have split the charts into 2, one chart showing danceability, acousticness, energy and instrumentalness and the other showing tempo. The reason being that the 4 attributes are all between 0 and 1 while tempo isn't. You can sort the charts in ascending order of the attributes and choose which time frame of the data of songs.

File: Chart.js

This file contains the charting code which we have used from recharts, which is a charting library built on React components. Due to how the attribute tempo is not between 0 and 1, we had two create two line charts, one primarily for tempo and the other for the rest

### Recommendations
File: recommendations.js

This page recommends songs based on your top artists or top tracks. There is an Spotify API call that can recommend songs based on the artists or songs that is in the query but the total is up to 5 songs and artists. Thus in order to make things more unpredictable and more fun, we've decided to randomly select 5 songs and artists to be used for the recommendations. There is a button that refreshes the randomly selected 5 songs or artists to keep things fresh. 

The API will then return a list of 100 songs based on either the top tracks or top artists selected by the tab. There is a refresh button if you want to randomly get another set of 100 songs based on the randomly selected top 5 tracks or artists. Clicking on the play button will send an API call to play the song on your Spotify player for you to listen to the song. If you enjoy the song and would like to add the song to a newly created playlist, you can simply select the songs by clicking on the check box and clicking on the create playlist button. This will create a playlist with the selected songs in your Spotify app. If 100 songs is too much for you to handle, you can also reduce the list by changing the number to what you want. Selecting all and unselecting all just makes things easier if you want to click all or none of the checkboxes. 

## Authors
Project is created and maintained by [Han Riffin](https://github.com/hanriffin) and [Jolene](https://github.com/blowindblo).  
