# Ecommerce API Project
It's an Ecommerce API implemented with Json Web Token Authentication with User Roles Permission verified with middleware

## Project Overview
It's an E-commerce API which verify what resources a user has access to and authenticate who someone is with use of Json Web Tokens authentication that allow access to API endpoints which provides data resources.
Access Token and RefreshToken will be provided at the point of login which both has expiration period. Access Token has a shorter period of expiration than Refresh Token. New Access Token will be issued when it expires at request of Refresh token by verifying with Midlleware. User Roles Permissions are also provided at different levels of access verified with middleware.

## Technologies Used
Javascript, Node.js,Express, cookieParser,fastest-validator, jsonwebtoken,bcrypt, mysql, sequelize, Post Man, Visual Studio Code, GitHub and Command Line
