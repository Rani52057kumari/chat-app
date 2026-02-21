# Contributing to Chat App

Thank you for your interest in contributing to Chat App! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, Node version)

### Suggesting Features

We welcome feature suggestions! Please create an issue with:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/chat-app.git
   cd chat-app
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   - Ensure the app runs without errors
   - Test on multiple browsers
   - Check mobile responsiveness

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Add screenshots for UI changes

## 📝 Code Style Guidelines

### JavaScript/React

- Use ES6+ features
- Prefer functional components with hooks
- Use meaningful variable and function names
- Keep functions small and focused
- Add JSDoc comments for complex functions

Example:
```javascript
/**
 * Send a message in the chat
 * @param {string} content - Message content
 * @param {File} file - Optional file attachment
 * @returns {Promise<Object>} Sent message object
 */
const sendMessage = async (content, file = null) => {
  // Implementation
};
```

### CSS/Tailwind

- Use Tailwind utility classes
- Keep custom CSS minimal
- Use semantic class names
- Maintain responsive design

### Backend

- Follow MVC pattern
- Use async/await for async operations
- Add proper error handling
- Validate all inputs
- Add descriptive comments

## 🏗️ Project Structure Guidelines

### Adding New Features

When adding new features:

1. **Backend**
   - Create model in `server/models/`
   - Add controller in `server/controllers/`
   - Create routes in `server/routes/`
   - Update middleware if needed

2. **Frontend**
   - Create components in `client/src/components/`
   - Add context if state management needed
   - Create service functions in `client/src/services/`
   - Update routes in `App.js`

## 🧪 Testing

Before submitting a PR:

- [ ] Code runs without errors
- [ ] All features work as expected
- [ ] No console errors or warnings
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Mobile responsive
- [ ] No accessibility issues

## 📚 Documentation

When adding features:

- Update README.md if needed
- Add JSDoc comments to functions
- Update API documentation
- Add setup instructions for new dependencies

## 🎨 Design Guidelines

- Follow WhatsApp-inspired UI patterns
- Maintain consistency with existing design
- Ensure dark/light mode compatibility
- Keep UI clean and intuitive
- Add loading states
- Provide user feedback for actions

## 🔒 Security

- Never commit sensitive data
- Use environment variables
- Validate all user inputs
- Sanitize data before database operations
- Follow authentication best practices

## 📋 Commit Message Format

Use clear, descriptive commit messages:

- `Add: new feature`
- `Fix: bug description`
- `Update: improvement description`
- `Refactor: code changes`
- `Docs: documentation updates`
- `Style: formatting changes`

## 🎯 Priority Areas

We especially welcome contributions in:

- Bug fixes
- Performance improvements
- UI/UX enhancements
- Documentation improvements
- Test coverage
- Accessibility improvements
- Mobile experience
- New features (discuss first)

## 💬 Communication

- Be respectful and constructive
- Ask questions if unclear
- Provide context in discussions
- Be patient with review process

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

## 🙏 Thank You!

Every contribution helps make Chat App better. We appreciate your time and effort!

---

**Questions?** Feel free to open an issue for clarification.
