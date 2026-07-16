package com.simtech.util;

import org.springframework.security.crypto.codec.Hex;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Component;

@Component
public class EncryptDecryptUtil {
	private static final String ENCRYPTION_PASSWORD = new String(Hex.encode("SMITECHENCPASSWORD".getBytes()));
	private static final String ENCRYPTION_SALT = new String(Hex.encode("SMITECHENCSALT".getBytes()));

	private final TextEncryptor textEncryptor;

	public EncryptDecryptUtil() {
		this.textEncryptor = Encryptors.text(ENCRYPTION_PASSWORD, ENCRYPTION_SALT);
	}

	public String encrypt(String data) {
		return textEncryptor.encrypt(data);
	}

	public String decrypt(String encryptedData) {
		return textEncryptor.decrypt(encryptedData);
	}
}
