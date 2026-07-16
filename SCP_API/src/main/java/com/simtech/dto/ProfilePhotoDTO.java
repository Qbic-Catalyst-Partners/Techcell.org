package com.simtech.dto;

public class ProfilePhotoDTO {
    private Long userId; // optional – if null take from token
    private byte[] profilePhoto;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public byte[] getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(byte[] profilePhoto) {
        this.profilePhoto = profilePhoto;
    }
} 