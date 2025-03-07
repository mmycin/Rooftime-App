# Support

## Getting Help

If you encounter any issues or have questions about the **Rooftime** app, here are some ways you can get support:

### 1. **GitHub Issues**
If you encounter bugs or have feature requests, feel free to open an issue in the [GitHub repository](https://github.com/mmycin/Rooftime-App). When submitting an issue, please provide the following information:
- Description of the problem or feature request
- Steps to reproduce the issue (if applicable)
- Any error messages or logs
- Screenshots (if applicable)

### 2. **Frequently Asked Questions (FAQ)**
For common queries, please check the [FAQ](FAQ.md). We cover a wide range of topics including installation, setup, and troubleshooting.

### 3. **Community & Discussions**
Join the conversation on the GitHub Discussions section to ask questions, share ideas, or get help from the community.

### 4. **Email Support**
If you need more personalized help, you can reach out to the development team at [support@mmycin.com](mailto:support@mmycin.com).

## Troubleshooting

Here are some common issues you may face and steps to resolve them:

### 1. **App Not Starting After Installation**
- **Possible Cause**: Missing or incorrect environment variables.
- **Solution**: Ensure that you have configured the `.env` file with the correct values. Check the `.env.example` for the required variables and set them in your `.env` file.

### 2. **Login Issues**
- **Possible Cause**: Invalid username or password.
- **Solution**: Double-check your credentials. If you forgot your password, use the reset option in the app or contact support if necessary.

### 3. **Real-Time Data Not Updating**
- **Possible Cause**: Internet connection issues or backend failure.
- **Solution**: Ensure that your internet connection is stable. If the issue persists, check the backend service or try restarting the app.

### 4. **Build Fails on Android/iOS**
- **Possible Cause**: Misconfigured environment or missing dependencies.
- **Solution**: Ensure that your environment is properly set up (e.g., Android Studio, Xcode). Run the following commands to ensure that dependencies are correctly synchronized:
  ```bash
  bunx cap sync
  ```

### 5. **Desktop App Installation Issues**
- **Possible Cause**: MSI installation failure.
- **Solution**: Ensure that you are using the correct version of the MSI installer generated during the build process. Try running the installer again and make sure that your system meets the requirements.

## Contributing

We welcome contributions! If you'd like to contribute to **Rooftime**, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Create a new pull request.

Please ensure that your code follows the coding conventions used in the project and passes the tests.

## Contact

If you have any further questions or need additional assistance, don't hesitate to reach out to us:

- **Email**: [mycin.mit@gmail.com](mailto:mycin.mit@gmail.com)
- **GitHub Issues**: [Open an issue](https://github.com/mmycin/Rooftime-App/issues)

We are always happy to help! Thank you for using **Rooftime**!