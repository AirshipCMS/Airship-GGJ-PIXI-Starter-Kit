# Airship Phaser Project


## Contents

* [**Description**](#description)
* [**Setup**](#setup)
* [**Documentation**](#documentation)
    * [Project Directory Structure](#project-directory-structure)
    * [Adding Game Assets](#adding-game-assets)
    * [Serving Your Game Locally](#serving-your-game-locally)
    * [Launching Your Game](#launching-your-game)
    * [CLI](#cli)

---

# Description


This project documents how to setup your Phaser game with Airship.

---

# Setup

1. ##### [ Airship Login ](#airship-login)

	- In your terminal, navigate to your project directory.

	- Run `airship login projectname`.

	 ![](./compartments/assets/media/airship_login.png?raw=true)

	- After running `airship login projectname`, you will be informed that you aren't in an AirshipCMS project. You will be asked if you would you like to set the current directory as the AirshipCMS project root for your site.

	 Enter `yes`or `y`.
	![login](./compartments/assets/media/airship_login3.png?raw=true)

	- Enter your Airship credentials. ![login2](./compartments/assets/media/airship_login2.png?raw=true)

2. ##### [ Airship Land ](#airship-land)

 	- In your terminal, run `airship land`.

 	 This will pull down all necessary Airship config files and initial project structure.

	 ![land](./compartments/assets/media/airship_land.png?raw=true)

	- After running `airship land` you will be asked if you want to download compartments to your project.

	 Enter `yes` or `y`.
![land2](./compartments/assets/media/airship_land2.png?raw=true)

3. ##### [ Airship Serve ](#airship-serve)
	- In your terminal, run `airship serve`.

 	 ![serve](./compartments/assets/media/airship_serve.png?raw=true)

 	 This starts the server that will render all of your project files locally. 

	- Open your browser and naviagte to `http://localhost:9001`. The page should look like the image below.
![](./compartments/assets/media/airship_serve2.png?raw=true)
	The content you see on this page is rendered by `/compartments/templates/root.html`. `root.html` is then injected into `/comparments/layouts/application.html`. Since we don't need this for our project, we will remove it.

	- In your project, navigate to `/comparments/layouts/`. In this directory, you should see the file `application.html`.

	- In `application.html`, you will see `{{{ template }}}` in the body.
	![](./compartments/assets/media/application.png?raw=true)
	This renders content from `/compartments/templates/root.html`. Since you won't use this file for your Phaser project, remove `{{{ template }}}` from `application.html`.
	![](./compartments/assets/media/application2.png?raw=true)

	 Now you're ready to go!

---

# Documentation

### Project Directory Structure
This is your project directory structure.

![](./compartments/assets/media/structure.png?raw=true)

For your Phaser project, you will be using the `assets` and `layout` directories.


##### /assets

- /scripts: Phaser and game scripts.

- /media: images, music, sound effects, etc (.png, .jpg, .mp3, etc).

- /styles: .css files.

The `assets` directory contains 3 subdirectories: `scripts`, `styles` and `media`.

Do not add any other directories or files immediately inside of `assets`.
The `scripts`, `styles` and `media` can have any number of subdirectories.


##### /layouts
- application.html: links to your media, scripts and styles.

The `layouts` directory mirrors the layouts set in the CMS.

For this project, you will be using `application.html` to link to your assets.

When linking to files in `assets`, paths should look like: `/assets/scripts/filename.js` or `/assets/media/filename.png`. 

---

### Adding Game Assets

1. ##### Scripts

	- In your project, navigate to `/compartments/assets/scripts/`.

	- Add your game scripts.

	 ![](./compartments/assets/media/scripts.png?raw=true)

	- Add your script files to the body of `/comparments/layouts/application.html`.
![](./compartments/assets/media/html_scripts.png?raw=true)

2. ##### Media
	- In your project, navigate to `/compartments/assets/media/`.

	- Add your game images, music, sfx, etc.

	 ![](./compartments/assets/media/media.png?raw=true)

3. ##### Styles
	- In your project, navigate to `/compartments/assets/styles/`.

	- Add your css files.

	- Add your css files to the head of `/comparments/layouts/application.html`.
	![](./compartments/assets/media/styles.png?raw=true)
---

### Serving Your Game Locally

1. ##### [Airship Serve](#airship-serve)

	- In your terminal, run `airship serve`.

	 ![](./compartments/assets/media/airship_serve.png?raw=true)

	 This starts the server that will render all of your project files locally. 

	- Open your browser and navigate to `http://localhost:9001`. To view any changes made to your game files, refresh this page.

* If you encounter this error while attempting to serve, [log in](#airship-login) to your Airship project then try again.![](./compartments/assets/media/unauthorized.png?raw=true)

---

### Launching Your Game

1. ##### Airship Manifest

	- In your terminal, run `airship manifest`.

	 ![](./compartments/assets/media/airship_manifest.png?raw=true)

	- This will ask you if you want to save and overwrite your local manifest. 

	 Enter `yes` or `y`.
	![](./compartments/assets/media/airship_manifest2.png?raw=true)

2. ##### Airship Launch

	- In your terminal, run `airship launch`.

	 ![](./compartments/assets/media/airship_launch.png?raw=true)

	- This will ask you to upload comparments. This will overwrite everything on the server.
	![](./compartments/assets/media/airship_launch2.png?raw=true)
	Enter `yes` or `y`.

	- Open your browser and navigate to `projectname.airshipcms.io`.

* If you encounter this error while attempting to launch, [log in](#airship-login) to your Airship project then try again. ![](./compartments/assets/media/unauthorized.png?raw=true)

* If you encounter an error like this while attempting to launch, you may have added a file type to the wrong directory or the file type you have added is unsupported. Please refer to the [Project Directory Structure](#project-directory-structure) section. ![](./compartments/assets/media/upload_failed.png?raw=true)

---

### CLI

#### airship login
Log in to your project with your _superadmin_ access level *email*, *password*, and your AirshipCMS *subdomain*.  
```
airship login projectname
```
*projectname* is the subdomain for your project. If your airshipcms.io project subdomain is "jumpslide.airshipcms.io", you would enter `airship login jumpslide` or `airship login jumpslide.airshipcms.io`.

This will connect you to the airship server for the project globally on your computer. If you have landed the project in more than one location, logging in will open the connection to airship for the project in all those locations.

#### airship land
Do this the *first time you work on the project*. This pulls down necessary Airship config files and initial project structure. After the first time, you should have all your files frequently backed up in Git, so you will never really have to run _airship land_ anymore, and you can simply create and launch your new files without ever landing again.  
```
airship land
```
If for some reason you want to pull down the files that are live, you can run airship land again. *Be sure you have backed up your local files* because airship land will overwrite them.

#### airship serve
Airship serve runs the server that will locally render layouts, templates, and pull content from Airship CMS. Keep this running in a dedicated a terminal tab, and use other tabs to run other airship commands and other project processes.

```
airship serve
```

#### airship launch
When you are ready to launch your local changes to production, run *airship launch*. This will overwrite all files on the server to match your local project structure. If you have added files locally, they will be added to the server. If you have deleted files locally, they will be deleted from the server.
```
airship launch
```
If for some reason you need to back up the state of production compartments, then *airship land* files in a separate directory, or better yet, you already have them backed up in a different branch using your source code management tool.
