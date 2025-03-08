import User from '../models/UserModel.js'
import OTP from "../models/OTPModel.js"
import userSchema from "../validations/UserValidation.js";

import cloudinary from 'cloudinary'
const useCloudinary = cloudinary.v2

import { argon2d } from 'argon2'
import multer from 'multer'
import path from 'path'
import nodemailer from 'nodemailer'
import fs from 'fs'

import { hashPassword, comparePasswords } from "../middlewares/PasswordManager.js";
import { getGoodTime } from '../utilities/simpleCodes.js';
import { response } from 'express';
import { request } from 'http';


//GETS AN ARRAY OF ALL USERS
export const getUsers = async (request, response) => {
  try {
    console.log('I got the request');
    const users = await User.find()
    response.status(200).json(users)
  } catch (error) {
    response.status(400).json({ message: error.message })
  }
}

//GETS A SPECIFIC USER BY THEIR EMAIL
export const getUserByEmail = async (request, response) => {
  try {
    console.log('Get user by email request received');

    const email = request.query.email; // Change this to `request.query.email` if using query params

    if (!email) {
      return response.status(400).json({ message: 'Email is required' });
    }

    console.log('Searching for user with email:', email);

    const theUser = await User.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });

    if (!theUser) {
      console.log('No user found for email:', email);
      return response.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', theUser);
    return response.status(200).json(theUser);

  } catch (error) {
    console.error('Error fetching user by email:', error.message);
    return response.status(500).json({ message: 'An error occurred while processing your request' });
  }
};

export const getUserByUsername = async (request, response) => {
  const username = request.query.username

  console.log(username);
  
  try {
    
    if (!username) return response.status(409).json({ message: 'Username is required' })

    const userExists = await User.findOne({ userName: username })

    if (userExists) {
      return response.status(200).json({ message: 'user found', user: userExists })
    } else {
      return response.json({ message: 'User doesnt exist' })
    }

  } catch (error) {
    return response.status(500).json({ message: 'An error occured' })
  }

}


export const sendAccountCreationOtp = async (request, response) => {
  console.log('Acc Creation OTP Sender Reached', request.body);

  const email = request.query.email
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

  const otpRecord = new OTP({email, otp, expiresAt})
  console.log('OTP Record', otpRecord);
  
  otpRecord.save()

  const accountExists = await User.findOne({ email: email })

  if (accountExists) {
    return response.status(409).json({ message: 'User with email already exists' })
  }

  //PROCEED TO SEND THE MAIL
  const sendOTPEmail = async (email, otp) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'edunphilips3@Gmail.com',
          pass: 'aukxagjlspshtbki'
        },
        tls: {
          rejectUnauthorized: false
        }
      })

      const { formattedDate, formattedTime } = getGoodTime()
      const sendTime = `on ${formattedDate} at ${formattedTime}`

      const mailConfig = {
        from: 'auth@chatee.com',
        to: email,
        subject: 'Chatee Account Creation OTP',
        text: `Your Chatee Account Creation OTP is ${otp}. This code was requested ${sendTime} Do not share this code with anyone.`
      }

      const mailResponse = await transporter.sendMail(mailConfig)
      console.log(mailResponse);
      if (mailResponse.accepted[0]) {
        console.log('Mail sent successfully.');
        response.status(200).json({ message: 'Mail Sent Successfully.', otp: otp })
      } else if (!mailResponse.accepted[0] || mailResponse.rejected[0]) {
        response.status(400).json({ message: 'Mail Rejected' })
      }

    } catch (error) {
      console.log('This error occured while trying to send the OTP Mail', error);
      response.status(400).json({ message: 'Error sending OTP Mail' })
    }
  }

  await sendOTPEmail(email, otp)

}

export const verifyAccountCreationOtp = async (request, response) => {
  const { email, otpInput } = request.body

  const otpRecord = await OTP.findOne({ email: email, otp: otpInput })

  if (!otpRecord) {
    return response.status(404).json({ message: 'Invalid OTP' })
  }

  if (otpRecord.expiresAt < new Date()) {
    return response.status(410).json({ message: 'OTP Expired' })
  }

  if (otpRecord.otp === otpInput) {
    return response.status(200).json({ message: 'OTP Verified' })
  } else {
    return response.status(404).json({ message: 'Invalid OTP' })
  }
  
}


export const createAccount = async (request, response) => {

  const { email, password, userName } = request.body
  
  console.log('This is the user credentials', {
    email, password, userName
  });

  try {
    //checking if user exists
    const userExists = await User.findOne({ email: email })
    if (userExists) {
      return response.status(409).json({ message: 'User with this email already exists' })
    }

    //hash password and create user object
    const hashedPassword = await hashPassword(password)
    const newUser = new User({
      email: email,
      password: hashedPassword,
      userName: userName
    })

    //save user
    const userCreated = await newUser.save()
    console.log('User created', userCreated);

    response.status(201).json({ message: 'User Created Successfully' })
        
  } catch (error) {
    console.log('error creating user', error);
  }
}


export const loginAccount = async (request, response) => {

  const { email, password } = request.body
  console.log('Login request received', request.body);
  
  try {
    const userDetails = await User.findOne({ email: email })
    if (!userDetails) {
      return response.status(404).json({ message: 'user not found' })
    }
    console.log('I got the user', userDetails);

    const passwordCorrect = comparePasswords(password, userDetails.password)

    if (!passwordCorrect) {
      return response.status(401).json({ message: 'incorrect password' })
    } else {
      return response.status(200).json({ message: 'Access Granted', userInfo: userDetails })
    }

    
    // const comparePasswords = comparePasswords(password, )

  } catch (error) {
    console.log('error logging in', error);
  }

}


