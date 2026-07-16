package com.simtech.service.impl;

import java.util.List;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.simtech.dao.UserRepository;
import com.simtech.entity.UserDetail;

@Service
public class LegacyUserMigrationService {

    private static final Logger logger = LoggerFactory.getLogger(LegacyUserMigrationService.class);

    @Autowired
    private UserRepository userRepository;

    /**
     * This method runs once when the application starts
     * It sets paymentReceived = true for all existing users
     */
//    @PostConstruct
    @Transactional
    public void migrateExistingUsers() {
        logger.info("Starting migration of legacy users for payment status");

        List<UserDetail> allUsers = userRepository.findAll();
        int updatedCount = 0;

        for (UserDetail user : allUsers) {
            if (!user.isPaymentReceived()) {
                user.setPaymentReceived(true);
                userRepository.save(user);
                updatedCount++;
            }
        }

        logger.info("Migration completed. Updated payment status for {} users", updatedCount);
    }
}