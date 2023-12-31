# Capstone Project

This is an E-Commerce Website hosted on Firebase. The assets for the project are stored in Firebase Database and Storage. Images stored alongside the code ([src/assets](src/assets) folder) are used for initial rendering of the website and cannot be stored anywhere lest the page layout be broken.

>> Start of school specific requirements

## This is a school project. The following are the requirements for the project

### Capstone Project: E-Commerce Application with Firebase Firestore

#### Objective

This capstone project aims to design and implement a fully functional e-commerce application using multimedia systems concepts and Firebase Firestore for backend storage and hosting. The project will also integrate social media authentication features, allowing users to log in using their Twitter, Facebook, or Google accounts.

> I couldn't implement "Facebook" authentication as I couldn't meet all the requirements to get my app authenticated or get the required authentication. I have implemented "Google" and "Twitter" authentication.
> I have implemented "Github" instead of "Facebook" authentication. Now, you can login using "Google", "Twitter" and "Github" accounts.

### Features to Implement

#### User Experience

- [x] **User Authentication**: Integrate OAuth to enable users to sign in using social media accounts (Twitter, Facebook, Google).
- [ ] **Product Gallery**: Display available products in an organized, visually appealing manner.
- [ ] **Shopping Cart**: Allow users to add items to their cart, view it, and proceed to checkout.
- [ ] **Order History**: Enable users to view their past orders.
- [ ] **Search and Filters**: Users should be able to search products and filter results based on categories, ratings, etc.
- [ ] **User Profiles**: Users should have profiles where they can view and manage their information.
- [x] **Product Reviews and Ratings**: Users should be able to review and rate purchased products.

#### Backend

- [ ] **Firebase Firestore**: Store product data, user profiles, and order histories in Firebase Firestore.
- [x] **File Hosting**: Use Firebase for hosting multimedia elements like product images.
- [x] **Data Management**: Structure Firestore collections and documents for optimal data access and security.
- [ ] **Backend Logic**: Implement backend logic for order processing, inventory management, etc.

### Evaluation

The project will be evaluated based on the following criteria:

1. **Functionality**: All features must be fully functional.
2. **User Experience**: Usability and design of the user interface.
3. **Code Quality**: Proper structure, readability, and documentation.
4. **Backend Structure**: Efficient use of Firebase Firestore and Firebase Authentication.
5. **Security**: Implementation of secure authentication and data access.

>> End of school specific requirements

## Installation

First [clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) the project to your local development. You can use `git` to clone the repo. For Linux, MacOS and most *nix OS'es have it installed by default. If on Windows or not installed you can download the repo as a zip file or install on windows [git for windows](https://gitforwindows.org/) or [other os'es](https://git-scm.com/).

```bash
git clone https://github.com/gekkowrld/capstone # To clone the repo
cd capstone # To head over to the repo
npm install # Install the required dependencies
npm start # To start the project locally
```

When running `npm` make sure you are running it on recognized `sh` variant. I recommend `bash` for its universal use. If on platforms that use unsupported `sh` variants, consider running `bash` command. In most platforms it is installed by default. On windows `powershell` is a pretty good shell to run npm on. You can refer to documentation on supported shells. For `fish` users refer to this <https://github.com/fish-shell/fish-shell/issues/3023>

Make sure you have the credentials as provided by [firebase sdk](https://firebase.google.com/docs/web/setup) for authentication. The information should be stored in a [`.env` file](https://medium.com/how-to-react/using-env-file-in-react-js-b2714235e77e) file at the root of the directory(or project).

The following data should be provided:

```env
REACT_APP_FIREBASE_API_KEY = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
REACT_APP_AUTH_ADMIN = "XXXXXXXXXXXXXXXXXXXXXXXXXX"
REACT_APP_DATABASE_URL = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
REACT_APP_PROJECT_ID = "XXXXXXXXXXXXXXXXXX"
REACT_APP_STORAGE_BUCKET = "XXXXXXXXXXXXXXXXXXXX"
REACT_APP_MESSAGING_SENDER_ID = "XXXXXXXXXXXXXX"
REACT_APP_APP_ID = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
REACT_APP_MEASUREMENT_ID = "X-XXXXXXXXX"
```

> Make sure to replace the `X' with the correct info.

## Firebase setup

After [registering your app](https://firebase.google.com/docs/web/setup) you need to a `collection` known as `books`. This will contain the products the you will display.

To make it easier to include the required data, you can use the following python script to add the data to the database.
The code can be found in the github gist [here](https://gist.github.com/gekkowrld/6cdbd3ca23648930fdd8611293d1f688)
Copy the link if the above link doesn't work <https://gist.github.com/gekkowrld/6cdbd3ca23648930fdd8611293d1f688>
You are free to modify the code as per your needs.
Or use your own method to add the data to the database.

Beware that loc.gov doesn't guarantee availability of all fields.
So, you may have to manually add the missing fields.
For the image field I have added a placeholder image.
The placeholder image is not actually uploaded to the database.
This is to provide flexibility on what image is to be displayed if the image is not available.
You can use the picsum api to generate a random image.

## Payment solution

I couldn't implement a payment solution as I don't have a credit card.
> Books for free, yay!

All the payment solutions I found required a credit card or a backend server.
Paypal can be a solution but it requires registration of a business account.

M-pesa was also on the list but again backend server is required.
As explained [here by instasend](https://developers.intasend.com/docs/payment-button) it can be done but it involves trusting a third party with a third party payment solution.
This is both a security risk and a privacy risk.

## Disclaimer

This project uses images, multimedia, info and other resources from the internet.
I do not own any of the resources used in this project.
This project is for educational purposes only.
I have tried to make the website responsive, but it may not be responsive on all devices.
The UI is not the best, but I have tried to make it as good as possible.
If you have any suggestions, please let me know.

The following resources are used in this project:

- [Firebase](https://firebase.google.com/) (Firebase Authentication, Firebase Firestore, Firebase Storage, Firebase Hosting)
- [React](https://reactjs.org/) (React, React DOM, React Scripts)
- [React Router](https://reactrouter.com/) (React Router DOM)
- [TailwindCSS](https://tailwindcss.com/) (Styling)
- [LOC.gov](https://www.loc.gov/) (Images, Info)
- [Picsum](https://picsum.photos/) (Images)
- [Amazon](https://www.amazon.com/) (Design, Info)
- [Goodreads](https://www.goodreads.com/) (Info, Design)
- [MDN](https://developer.mozilla.org/) (Info, resources)
- [Google](https://www.google.com/) (Info, resources)
- [Stack Overflow](https://stackoverflow.com/) (Info, resources)
- [Github](https://github.com) (code hosting, resources)
- AI (Info, resources, copilot)

This project is released under the [UNLICENSE License](UNLICENSE). Please see the `UNLICENSE` file for more information. If the license is not suitable for your use case, you can use the resources used in this project according to the license of the respective resource. The logo(s) of the project is also released under the same license.

I have tried to include the attributes of the resources used in this project in the respective file of each project. If you find any resource that is not properly attributed, please let me know and I will update the `README.md` and or file(s) of the project.

I'm using the free tier of Firebase. So, the project may not work if the free tier is exhausted. If you find any issues, please let me know and I will try to fix it as soon as possible. You can [open a new issue](https://github.com/gekkowrld/capstone/issues/new). If you are wondering on what I'm talking about, please refer to [Firebase Pricing](https://firebase.google.com/pricing) and this [Stack Overflow Question](https://stackoverflow.com/questions/67297700/firebase-spark-plan-hosting-daily-or-monthly-data-transfer-limits). If you see this message, it means that the free tier has been exhausted and the project is not working, and I'm popular, yay!

![Quota exceeded](https://i.stack.imgur.com/qVCkD.png)

:warning: **Don't use this repo (or the code inside) in production (or anywhere that security is of utmost importance) as it has security issues. This issues are due to some dependencies that react depends on and cannot be easily updated because of [dependency hell](https://blog.tidelift.com/dependency-hell) and other issues. This dependency security issues range from moderate to high. Please look at the dependencies and try and resolve the issues**
