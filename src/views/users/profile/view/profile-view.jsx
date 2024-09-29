import Cookies from 'js-cookie';
import React, { useState } from 'react';

import { Grid, Button, Select, Divider, MenuItem, Checkbox, Container, TextField, Typography, InputLabel, FormControl } from '@mui/material';

import ProfileService from 'src/services/users/profileService';

export default function ProfileView() {
  const [formData, setFormData] = useState({
    user: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bio: '',
    panNumber: '',
    aadhaarNumber: '',
    email: '',
    phoneNumber: '',

    location: {
      city: '',
      state: '',
      country: '',
    },
    profilePicture: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
    },
    hasDematAccount: false,
    bankAccount: {
      accountNumber: '',
      ifscCode: '',
      bankName: '',
    },
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
    },
  });
  const username = Cookies.get('username');
  const lastLoginTime = Cookies.get('lastLoginTime');
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;


    // For nested objects, create copies of each level of nesting
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prevState => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      // For non-nested properties, update directly
      setFormData(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await ProfileService.create(formData);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
        Hi, {username} Welcome back 👋
        {lastLoginTime && (
          <Typography variant="body1" sx={{ ml: 2 }}>
            Last login: {lastLoginTime}
          </Typography>
        )}
      </Typography>
      {/* <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, {username} Welcome back 👋
      </Typography> */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                name="gender"
                label='Gender'
                labelId="gender-label"
                value={formData.gender}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="phoneNumber"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Location */}
          <Grid item xs={12} md={4}>
            <TextField
              name="location.city"
              label="City"
              value={formData.location.city}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              name="location.state"
              label="State"
              value={formData.location.state}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              name="location.country"
              label="Country"
              value={formData.location.country}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Bio */}
          <Grid item xs={12}>
            <TextField
              name="bio"
              label="Bio"
              multiline
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Profile Picture */}
          <Grid item xs={12}>
            <TextField
              name="profilePicture"
              label="Profile Picture URL"
              value={formData.profilePicture}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Social Links */}
          <Grid item xs={12} md={3}>
            <TextField
              name="socialLinks.facebook"
              label="Facebook"
              value={formData.socialLinks.facebook}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              name="socialLinks.twitter"
              label="Twitter"
              value={formData.socialLinks.twitter}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              name="socialLinks.linkedin"
              label="LinkedIn"
              value={formData.socialLinks.linkedin}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              name="socialLinks.instagram"
              label="Instagram"
              value={formData.socialLinks.instagram}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Aadhaar and PAN Numbers */}
          <Grid item xs={12} md={6}>
            <TextField
              name="aadhaarNumber"
              label="Aadhaar Number"
              value={formData.aadhaarNumber}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="panNumber"
              label="PAN Number"
              value={formData.panNumber}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Bank Account Information */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="bankAccount.bankName"
              label="Bank Name"
              value={formData.bankAccount.bankName}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="bankAccount.accountNumber"
              label="Bank Account Number"
              value={formData.bankAccount.accountNumber}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              name="bankAccount.ifscCode"
              label="IFSC Code"
              value={formData.bankAccount.ifscCode}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Address Information */}
          <Grid item xs={12} md={4}>
            <TextField
              name="address.street"
              label="Street"
              value={formData.address.street}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              name="address.city"
              label="City"
              value={formData.address.city}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              name="address.state"
              label="State"
              value={formData.address.state}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="address.country"
              label="Country"
              value={formData.address.country}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="address.pincode"
              label="Pincode"
              value={formData.address.pincode}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Divider */}
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {/* Demat Account */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="hasDematAccount-label">Has Demat Account</InputLabel>
              <Checkbox
                name="hasDematAccount"
                checked={formData.hasDematAccount}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          {/* Divider */}
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

