Here’s the FAQ based on your description of the Rooftime app:

---

# FAQ - Rooftime App

Welcome to the Rooftime App FAQ! Below you'll find answers to common questions. If you need further assistance, feel free to reach out to our support team.

---

## **1. What is Rooftime?**

Rooftime is a study tracking app that allows users to log study time, view performance insights, and participate in a leaderboard system. It includes features such as real-time timers, personalized feedback, and progress tracking, all designed to help you stay productive and on track with your study goals.

---

## **2. How do I log in?**

To log in, simply enter your username and password on the login page. Once authorized, you'll receive a JWT token that is valid for 3 days, allowing you to access your profile and all other features securely.

---

## **3. How can I view and edit my profile?**

You can visit your profile page to view your account details. The page is optimized for both desktop and mobile views. To edit your information, click on the "Edit Profile" button, and you can update your personal details. Your password is hashed and encrypted for security.

---

## **4. How is my data protected?**

Your data is protected through end-to-end encryption in JSON format. Additionally, your password is hashed with a random salt multiple times, making it uncrackable.

---

## **5. What are the leaderboard segments?**

The leaderboard has two main segments:

- **Daily Benchmark**: Displays the study time of users for the current day, with the top 3 users highlighted.
- **Weekly Benchmark**: Features three filters:
  - **Time**: Benchmarks users based on the total time studied this week.
  - **Weekly Score**: Ranks users based on points accumulated from their ranking (5 for 1st, 3 for 2nd, 1 for 3rd).
  - **Total Score**: Shows the total score accumulated by users over time.

---

## **6. How does the timer work?**

The Timer page features a stopwatch that can be paused and started. Your study time is updated in real time in the leaderboard. There are two ways to edit the timer: through a scroll wheel or an input field. You can also reset the timer. The timer rounds seconds to minutes if 50% of a minute is elapsed using a ReLU-type function.

---

## **7. What does the Performance page show?**

The Performance page includes an animated line chart showing your study time for the past week. It also provides the average study time and the peak study time for the week. Below the chart, you will receive personalized feedback from the AI, which analyzes your study habits and gives suggestions on how to improve.

---

## **8. How does the user comparison feature work?**

On the leaderboard, you can click the info button next to each user’s name to view their profile. The profile page includes a comparison of their study time with yours for the past week, displayed as an animated line chart. The AI provides feedback on how you can improve and how to get better results than the user you're compared to.

---

## **9. How do I run the app manually?**

To run the app manually, follow these steps:

1. Clone the repository:  
   `git clone https://github.com/mmycin/Rooftime-App`
   
2. Configure the environment variables using the `.env.example` file.

3. Run the following commands:

```sh
$ bun run build
$ bun run preview
```

---

## **10. How do I set up the app for desktop?**

For desktop setup (using Tauri and Rust):

1. Run:

```sh
$ bun run tauri run build
```

2. This will generate the **Rooftime_Setup.msi** file in `/src-tauri/target/release/bundle/` directory. Double-click it to install.

---

## **11. How do I set up the app for mobile (Android/iOS)?**

To set up the app for mobile:

1. Add Android or iOS platform:

```sh
$ bunx cap add android # For Android
$ bunx cap add ios # For iOS
```

2. Configure the app files:

```sh
$ bun run build
$ bunx cap copy
$ bunx cap sync
```

3. To open the project:

```sh
$ bunx cap open android # Open in Android Studio
$ bunx cap open ios # Open in Xcode
```

4. To build the app for Android or iOS:

```sh
$ bunx cap build android
$ bunx cap build ios
```

---

## **12. How do I build the Android or iOS app?**

To build the app for Android or iOS, use the following commands:

- For Android:

```sh
$ bunx cap build android
```

- For iOS:

```sh
$ bunx cap build ios
```

These commands will generate the respective application file for each operating system.

---

## **13. Is Rooftime available on mobile devices?**

Yes! Rooftime is available as a mobile app for both Android and iOS. You can build and deploy the app using the instructions above or download it from the release secton.

---

## **14. Can I contribute to Rooftime?**

Yes! Feel free to contribute by submitting a pull request on GitHub. Make sure to follow the contribution guidelines in the repository.

---

We hope this FAQ helps! If you have any further questions, feel free to reach out to our support team.
